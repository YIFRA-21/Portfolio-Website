from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.projects_list, name='projects_list'),
    path('projects/create/', views.project_create, name='project_create'),
    path('projects/<int:pk>/delete/', views.project_delete, name='project_delete'),
    path('projects/<int:pk>/update/', views.project_update, name='project_update'),
    path('contact/', views.contact_submit, name='contact_submit'),
    path('contact/messages/', views.messages_list, name='messages_list'),
    path('contact/messages/<int:pk>/delete/', views.message_delete, name='message_delete'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/profile/update/', views.profile_update, name='profile_update'),
    

]
