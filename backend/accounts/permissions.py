from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Only admin users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin()

class IsTeacher(permissions.BasePermission):
    """Only teacher users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_teacher()

class IsStudent(permissions.BasePermission):
    """Only student users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_student()

class IsConsultant(permissions.BasePermission):
    """Only consultant users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_consultant()

class IsTeacherOrAdmin(permissions.BasePermission):
    """Teacher or admin users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_teacher() or request.user.is_admin())

class IsStudentOrAdmin(permissions.BasePermission):
    """Student or admin users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_student() or request.user.is_admin())

