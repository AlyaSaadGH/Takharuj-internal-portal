import os
import re
import subprocess
import tempfile
import unicodedata
from io import BytesIO
from pathlib import Path

from django.conf import settings
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


OCR_ROOT = settings.BASE_DIR.parent / ".local" / "ocr" / "root"
TESSERACT = OCR_ROOT / "usr" / "bin" / "tesseract"
TESSDATA = OCR_ROOT / "usr" / "share" / "tesseract-ocr" / "5" / "tessdata"
OCR_LIB = OCR_ROOT / "usr" / "lib" / "x86_64-linux-gnu"
ARABIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")
ROW_LABELS = [
    "taxpayer name", "اسم المكلف", "اسم المنشأة", "اسم الشركة",
    "vat registration number", "رقم التسجيل الضريبي", "taxpayer address", "عنوان المكلف", "عنوان المنشأة",
    "commercial registration", "cr / license", "contact / id no", "السجل التجاري", "رقم السجل",
    "الرخصة", "العقد", "الهوية", "city", "المدينة", "street", "الشارع",
    "building number", "رقم المبنى", "district", "الحي", "postal code", "zip code", "الرمز البريدي",
]


def _prepare_image(image):
    image = ImageOps.exif_transpose(image).convert("L")
    if max(image.size) < 2200:
        scale = min(3, 2200 / max(image.size))
        image = image.resize((int(image.width * scale), int(image.height * scale)))
    image.thumbnail((4000, 4000))
    image = ImageOps.autocontrast(image)
    image = ImageEnhance.Contrast(image).enhance(1.35)
    return image.filter(ImageFilter.SHARPEN)


def _ocr_image(image):
    if not TESSERACT.is_file():
        return ""
    with tempfile.NamedTemporaryFile(suffix=".png") as source:
        _prepare_image(image).save(source.name, "PNG")
        env = os.environ.copy()
        env["TESSDATA_PREFIX"] = str(TESSDATA)
        env["LD_LIBRARY_PATH"] = f"{OCR_LIB}:{env.get('LD_LIBRARY_PATH', '')}"
        completed = subprocess.run(
            [str(TESSERACT), source.name, "stdout", "-l", "ara+eng", "--psm", "6"],
            capture_output=True, text=True, timeout=45, env=env, check=False,
        )
        return completed.stdout if completed.returncode == 0 else ""


def _pdf_text_and_images(content):
    parts = []
    try:
        from pypdf import PdfReader
        parts.append("\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages[:10]))
    except Exception:
        pass
    try:
        import fitz
        document = fitz.open(stream=content, filetype="pdf")
        for page in document[:3]:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2), alpha=False)
            parts.append(_ocr_image(Image.open(BytesIO(pixmap.tobytes("png")))))
        document.close()
    except Exception:
        pass
    return "\n".join(parts)


def _digits(value):
    return re.sub(r"\D", "", value.translate(ARABIC_DIGITS))


def _number_near_labels(lines, labels, lengths):
    for index, line in enumerate(lines):
        if any(label in line.lower() for label in labels):
            area = " ".join(lines[index:index + 3])
            for raw in re.findall(r"(?:[٠-٩۰-۹\d][\s\-]*){4,20}", area):
                number = _digits(raw)
                if len(number) in lengths:
                    return number
    return ""


def _clean_row_value(value):
    cleaned = value
    for label in sorted(ROW_LABELS, key=len, reverse=True):
        cleaned = re.sub(re.escape(label), " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^[\s:：|،,.\-–—]+|[\s:：|،,.\-–—]+$", "", cleaned)
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return cleaned[:255]


def _text_near_labels(lines, labels):
    for index, line in enumerate(lines):
        lowered = line.lower()
        if any(label in lowered for label in labels):
            candidate = _clean_row_value(line)
            if not candidate and index + 1 < len(lines):
                candidate = _clean_row_value(lines[index + 1])
            if candidate and not candidate.isdigit() and not re.search(
                r"vat registration certificate|شهادة تسجيل|هيئة الزكاة|tax and customs authority",
                candidate, re.IGNORECASE,
            ):
                return candidate[:255]
    return ""


def _parse_address(value):
    """Split one compact ZATCA address row into the invoice address fields only."""
    result = {"city": "", "street": "", "building_number": "", "district": "", "postal_code": ""}
    if not value:
        return result
    value = value.translate(ARABIC_DIGITS)
    parts = [_clean_row_value(part) for part in re.split(r"[,،|]+", value)]
    parts = [part for part in parts if part]
    if not parts:
        return result

    numeric_positions = []
    text_parts = []
    for index, part in enumerate(parts):
        number = _digits(part)
        if part.replace(" ", "").isdigit() and len(number) in {4, 5}:
            numeric_positions.append((index, number))
            if len(number) == 5 and not result["postal_code"]:
                result["postal_code"] = number
            elif len(number) == 4 and not result["building_number"]:
                result["building_number"] = number
        else:
            text_parts.append((index, part))

    street_pattern = re.compile(r"\b(street|road|st\.)\b|شارع|طريق|الملك|الأمير|الامير", re.IGNORECASE)
    street_entry = next(((index, part) for index, part in text_parts if street_pattern.search(part)), None)
    if street_entry:
        result["street"] = street_entry[1]
        text_parts = [entry for entry in text_parts if entry != street_entry]

    postal_position = next((index for index, number in numeric_positions if len(number) == 5), None)
    ordered_text = [part for _, part in text_parts]
    if postal_position == 0:
        ordered_text.reverse()
    if ordered_text:
        result["city"] = ordered_text[0]
    if len(ordered_text) > 1:
        result["district"] = ordered_text[1]
    if not result["street"] and len(ordered_text) > 2:
        result["street"] = ordered_text[2]
    return result


def _repair_reversed_arabic(value):
    value = re.sub(r"[\u200e\u200f\u202a-\u202e\u2066-\u2069]", "", value)
    value = re.sub(r"\s+", " ", value[::-1]).strip(" .|،,-")
    words = value.split()
    for index in range(len(words) - 1):
        if words[index].endswith("ا") and words[index + 1].startswith("ل"):
            words[index] = words[index][:-1]
            words[index + 1] = "ال" + words[index + 1][1:]
    return " ".join(word for word in words if word)


def _national_address_fields(lines):
    """Read Saudi National Address proofs, including PDFs with reversed Arabic glyph order."""
    result = {
        "taxpayer_name": "", "city": "", "street": "",
        "building_number": "", "district": "", "postal_code": "",
    }
    compact_lines = [re.sub(r"[^\u0600-\u06ff0-9]", "", line) for line in lines]
    label_patterns = {
        "building_number": (r"^ىنبملامقر$",),
        "street": (r"^رعاشلا$",),
        "district": (r"^يحلا$",),
        "postal_code": (r"^يديربل.*زمرلا$", r"^يديربزمر$"),
        "city": (r"^ةنيدملا$",),
    }

    for field, patterns in label_patterns.items():
        for index, compact in enumerate(compact_lines):
            if not any(re.search(pattern, compact) for pattern in patterns):
                continue
            for candidate in lines[index + 1:index + 4]:
                number = _digits(candidate)
                if field == "building_number" and candidate.replace(" ", "").isdigit() and len(number) == 4:
                    result[field] = number
                    break
                if field == "postal_code" and candidate.replace(" ", "").isdigit() and len(number) == 5:
                    result[field] = number
                    break
                if field in {"street", "district", "city"} and re.search(r"[\u0600-\u06ff]", candidate):
                    value = _repair_reversed_arabic(candidate)
                    if value and not _digits(value):
                        result[field] = value
                        break
            if result[field]:
                break

    for index, line in enumerate(lines):
        if "شركة" not in line:
            continue
        candidate = line[line.index("شركة"):]
        candidate = re.sub(r"[\d|[\]{}]+", " ", candidate)
        candidate = re.sub(r"\s+", " ", candidate).strip()
        if index + 1 < len(lines):
            continuation = re.sub(r"^[\s|]*سم\s+", "", lines[index + 1]).strip(" |")
            if re.search(r"الاستشارات|القانونية|المحاماة", continuation):
                candidate = f"{candidate} {continuation}"
        result["taxpayer_name"] = _clean_row_value(re.sub(r"\s+", " ", candidate).strip())
        break
    return result


def parse_certificate_text(text):
    normalized = unicodedata.normalize("NFKC", text).translate(ARABIC_DIGITS)
    lines = [re.sub(r"\s+", " ", line).strip() for line in normalized.splitlines() if line.strip()]
    compact_digits = [_digits(raw) for raw in re.findall(r"(?:\d[\s\-]*){10,18}", normalized)]
    vat = next((number for number in compact_digits if len(number) == 15 and number.startswith("3") and number.endswith("3")), "")
    vat = vat or _number_near_labels(lines, ["vat", "ضريبي", "الضريبة"], {15})
    cr = _number_near_labels(lines, ["commercial registration", "cr number", "السجل التجاري", "رقم السجل"], {10})
    if not cr:
        cr = next((number for number in compact_digits if len(number) == 10 and number not in vat), "")
    address = _text_near_labels(lines, ["taxpayer address", "عنوان المكلف", "عنوان المنشأة"])
    address_fields = _parse_address(address)
    national_fields = _national_address_fields(lines)
    is_national_address = sum(bool(national_fields[key]) for key in (
        "city", "street", "building_number", "district", "postal_code"
    )) >= 3
    if is_national_address:
        cr = ""
    return {
        "taxpayer_name": national_fields["taxpayer_name"] or _text_near_labels(lines, ["taxpayer name", "اسم المكلف", "اسم المنشأة", "اسم الشركة"]),
        "vat_registration_number": vat,
        "cr_license_number": cr,
        "city": national_fields["city"] or _text_near_labels(lines, ["city", "المدينة"]) or address_fields["city"],
        "street": national_fields["street"] or _text_near_labels(lines, ["street", "الشارع"]) or address_fields["street"],
        "building_number": national_fields["building_number"] or _number_near_labels(lines, ["building number", "رقم المبنى"], {4}) or address_fields["building_number"],
        "district": national_fields["district"] or _text_near_labels(lines, ["district", "الحي"]) or address_fields["district"],
        "postal_code": national_fields["postal_code"] or _number_near_labels(lines, ["postal code", "zip code", "الرمز البريدي"], {5}) or address_fields["postal_code"],
    }


def extract_certificate(content, extension):
    if extension == ".pdf":
        text = _pdf_text_and_images(content)
    else:
        try:
            text = _ocr_image(Image.open(BytesIO(content)))
        except Exception:
            text = ""
    return parse_certificate_text(text), text
