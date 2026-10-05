from rest_framework.views import exception_handler

def json_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and not isinstance(response.data, dict):
        response.data = {"detail": response.data}
    return response

