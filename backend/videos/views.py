from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Video
from .serializers import VideoSerializer
from accounts.permissions import IsTeacherOrAdmin, IsAdmin

# ---------------- Upload Video ----------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsTeacherOrAdmin])
def upload_video(request):
    """
    Upload a new video.
    - Only teachers can upload videos.
    - Requires authentication (token).
    - Accepts video file (MP4) and optional thumbnail.
    - Videos are not approved by default and need admin approval.
    """
    serializer = VideoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(uploader=request.user, approved=False)  # link video to logged-in user, not approved by default
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- List All Videos ----------------
@api_view(['GET'])
def list_videos(request):
    """
    List all approved videos.
    - Anyone can access approved videos.
    - Admin can see all videos including unapproved ones.
    """
    if request.user.is_authenticated and request.user.is_admin():
        videos = Video.objects.all().order_by('-created_at')
    else:
        videos = Video.objects.filter(approved=True).order_by('-created_at')
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

# ---------------- Video Detail ----------------
@api_view(['GET'])
def video_detail(request, pk):
    """
    Retrieve a single video by its ID.
    - Only approved videos are visible to non-admins.
    """
    try:
        video = Video.objects.get(pk=pk)
        # Non-admins can only see approved videos
        if not request.user.is_authenticated or not request.user.is_admin():
            if not video.approved:
                return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = VideoSerializer(video)
    return Response(serializer.data)

# ---------------- Approve Video ----------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdmin])
def approve_video(request, pk):
    """
    Approve a video (admin only).
    """
    try:
        video = Video.objects.get(pk=pk)
        video.approved = True
        video.save()
        return Response({'message': 'Video approved successfully'}, status=status.HTTP_200_OK)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
