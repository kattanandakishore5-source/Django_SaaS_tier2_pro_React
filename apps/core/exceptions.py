from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    """
    Custom exception handler to normalize all DRF errors into a standard payload:
    {
        "error": "Summary of the error",
        "details": {
            "field_name": ["Specific error detail"]
        }
    }
    """
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        error_summary = "An error occurred."
        if response.status_code == 400:
            error_summary = "Validation Error"
        elif response.status_code == 401:
            error_summary = "Unauthorized"
        elif response.status_code == 403:
            error_summary = "Permission Denied"
        elif response.status_code == 404:
            error_summary = "Not Found"
        elif response.status_code >= 500:
            error_summary = "Server Error"

        original_data = response.data
        details = {}
        
        if isinstance(original_data, dict):
            if "detail" in original_data:
                error_summary = str(original_data["detail"])
            elif "error" in original_data:
                error_summary = str(original_data["error"])
            else:
                details = original_data
        elif isinstance(original_data, list):
            details = {"non_field_errors": original_data}
        else:
            details = {"detail": [str(original_data)]}

        response.data = {
            "error": error_summary,
            "details": details
        }

    return response
