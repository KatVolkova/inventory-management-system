from django.shortcuts import render


def custom_404_view(request, exception):
    """
    Custom view to handle 404 (Page Not Found) errors.
    """
    return render(request, '404.html', status=404)


def custom_500_view(request):
    """
    Custom view to handle 500 (Internal Server Error).
    """
    return render(request, '500.html', status=500)
