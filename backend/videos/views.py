from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Video
from .serializers import VideoSerializer

# ---------------- Upload Video ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):
    """
    Upload a new video.
    - Requires authentication (token).
    - Accepts video file (MP4) and optional thumbnail.
    """
    serializer = VideoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(uploader=request.user)  # link video to logged-in user
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- List All Videos ----------------
@api_view(['GET'])
def list_videos(request):
    """
    List all videos.
    - Anyone can access.
    """
    videos = Video.objects.all().order_by('-created_at')
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

# ---------------- Video Detail ----------------
@api_view(['GET'])
def video_detail(request, pk):
    """
    Retrieve a single video by its ID.
    """
    try:
        video = Video.objects.get(pk=pk)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = VideoSerializer(video)
    return Response(serializer.data)
