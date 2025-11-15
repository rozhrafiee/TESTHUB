from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Note, NotePurchase
from .serializers import NoteSerializer, NotePurchaseSerializer
from accounts.permissions import IsAdmin, IsStudentOrAdmin

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_note(request):
    """Upload a new note (students and teachers)"""
    serializer = NoteSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        note = serializer.save(uploader=request.user, approved=False)
        
        # Students can only upload free notes
        if request.user.is_student():
            note.is_paid = False
            note.price = 0.00
            note.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_notes(request):
    """List all approved notes"""
    if request.user.is_authenticated and request.user.is_admin():
        # Admin can see all notes
        notes = Note.objects.all().order_by('-created_at')
    else:
        # Others see only approved notes
        notes = Note.objects.filter(approved=True).order_by('-created_at')
    
    serializer = NoteSerializer(notes, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def note_detail(request, pk):
    """Get note details"""
    try:
        note = Note.objects.get(pk=pk)
        
        # Non-admins can only see approved notes
        if not request.user.is_authenticated or not request.user.is_admin():
            if not note.approved:
                return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if paid note is purchased
            if note.is_paid and request.user.is_authenticated:
                if not NotePurchase.objects.filter(student=request.user, note=note).exists():
                    # Return note info but without file access
                    serializer = NoteSerializer(note, context={'request': request})
                    return Response({
                        **serializer.data,
                        'file': None,
                        'message': 'This is a paid note. Please purchase to access the file.'
                    })
        
    except Note.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = NoteSerializer(note, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudentOrAdmin])
def purchase_note(request, pk):
    """Purchase a paid note (students only)"""
    try:
        note = Note.objects.get(pk=pk, approved=True, is_paid=True)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found or not available for purchase'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already purchased
    if NotePurchase.objects.filter(student=request.user, note=note).exists():
        return Response({'message': 'Note already purchased'}, status=status.HTTP_200_OK)
    
    # Create purchase record (in real app, you'd process payment here)
    purchase = NotePurchase.objects.create(student=request.user, note=note)
    serializer = NotePurchaseSerializer(purchase)
    return Response({
        'message': 'Note purchased successfully',
        'purchase': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_notes(request):
    """Get notes uploaded by current user"""
    notes = Note.objects.filter(uploader=request.user).order_by('-created_at')
    serializer = NoteSerializer(notes, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudentOrAdmin])
def my_purchases(request):
    """Get notes purchased by current student"""
    purchases = NotePurchase.objects.filter(student=request.user).order_by('-purchased_at')
    serializer = NotePurchaseSerializer(purchases, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdmin])
def approve_note(request, pk):
    """Approve a note (admin only)"""
    try:
        note = Note.objects.get(pk=pk)
        note.approved = True
        note.save()
        return Response({'message': 'Note approved successfully'}, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
