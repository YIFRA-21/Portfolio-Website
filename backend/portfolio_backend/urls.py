import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

def serve_react(request, path=''):
    frontend_dist_dir = os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist')
    
    # If path is empty, serve index.html
    if not path:
        return serve(request, 'index.html', document_root=frontend_dist_dir)
        
    # Check if the requested file exists in dist
    file_path = os.path.join(frontend_dist_dir, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return serve(request, path, document_root=frontend_dist_dir)
        
    # Otherwise, fall back to index.html for React Router routing
    return serve(request, 'index.html', document_root=frontend_dist_dir)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Serve static assets folder directly for performance
    path('assets/<path:path>', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'assets'),
    }),
    
    # Catch-all for root assets and SPA routing
    re_path(r'^(?P<path>.*)$', serve_react),
]
