from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Field
from .serializers import FieldSerializer
from accounts.permissions import IsAdmin

@api_view(['GET'])
def list_fields(request):
    """List all available fields"""
    fields = Field.objects.all().order_by('name')
    serializer = FieldSerializer(fields, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def field_detail(request, pk):
    """Get detailed information about a field"""
    try:
        field = Field.objects.get(pk=pk)
    except Field.DoesNotExist:
        return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FieldSerializer(field)
    return Response(serializer.data)

@api_view(['GET'])
def field_by_name(request, name):
    """Get field information by name"""
    try:
        field = Field.objects.get(name=name)
    except Field.DoesNotExist:
        return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FieldSerializer(field)
    return Response(serializer.data)

@api_view(['POST', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdmin])
def create_or_update_field(request, pk=None):
    """Create or update field information (admin only)"""
    if request.method == 'POST':
        serializer = FieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # PUT
    try:
        field = Field.objects.get(pk=pk)
    except Field.DoesNotExist:
        return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FieldSerializer(field, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
