from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import ForumMessage
from .serializers import ForumMessageSerializer
from accounts.permissions import IsStudent

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def forum_messages(request):
    """Get or post messages in student forum"""
    if request.method == 'GET':
        messages = ForumMessage.objects.all().order_by('-created_at')[:100]  # Last 100 messages
        serializer = ForumMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    # POST - Send message
    serializer = ForumMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def delete_message(request, pk):
    """Delete own message"""
    try:
        message = ForumMessage.objects.get(pk=pk, sender=request.user)
        message.delete()
        return Response({'message': 'Message deleted successfully'}, status=status.HTTP_200_OK)
    except ForumMessage.DoesNotExist:
        return Response({'error': 'Message not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

