from django.shortcuts import render


def custom_404_view(request, exception):
    """
    Custom view to handle 404 (Page Not Found) errors.
    """
    return render(request, '404.html', status=404)
