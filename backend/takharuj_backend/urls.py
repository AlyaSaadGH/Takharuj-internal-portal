from django.contrib import admin
from django.conf import settings
from django.http import FileResponse, Http404, HttpResponsePermanentRedirect
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("takharuj-admin/", lambda request: HttpResponsePermanentRedirect("/admin/")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger"),
    path("api/", include("core.urls")),
]

public_root = settings.BASE_DIR.parent / "public"
def frontend(request, asset="index.html"):
    target = (public_root / (asset or "index.html")).resolve()
    if public_root.resolve() not in target.parents or not target.is_file():
        raise Http404
    response = FileResponse(target.open("rb"))
    if target.suffix.lower() == ".html":
        response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response["Pragma"] = "no-cache"
    return response
urlpatterns += [
    re_path(r"^frontend-assets/(?P<asset>.*)$", frontend),
    re_path(r"^(?P<asset>.*)$", frontend),
]
