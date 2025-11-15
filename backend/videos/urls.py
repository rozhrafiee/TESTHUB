from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_videos, name='list_videos'),           # GET all videos
    path('upload/', views.upload_video, name='upload_video'),  # POST new video
    path('<int:pk>/', views.video_detail, name='video_detail'), # GET single video
    path('<int:pk>/approve/', views.approve_video, name='approve_video'), # POST approve video (admin)
]
