from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'TestHub API',
        'version': '1.0',
        'endpoints': {
            'accounts': '/accounts/',
            'exams': '/exams/',
            'videos': '/videos/',
            'notes': '/notes/',
            'consultations': '/consultations/',
            'fields': '/fields/',
            'forums': '/forums/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('videos/', include('videos.urls')),
    path('exams/', include('exams.urls')),
    path('consultations/', include('consultations.urls')),
    path('notes/', include('notes.urls')),
    path('fields/', include('fields.urls')),
    path('forums/', include('forums.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)