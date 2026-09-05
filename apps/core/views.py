from django.db import transaction
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from apps.accounts.models import CustomUser
from apps.billing.entitlements import get_user_limit, LIMIT_PROJECTS
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Enforce tenant isolation: users only see their own projects
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            # Lock the user row to prevent race conditions when checking limits
            user = CustomUser.objects.select_for_update().get(id=self.request.user.id)
            
            project_count = Project.objects.filter(user=user).count()
            limit = get_user_limit(user, LIMIT_PROJECTS)
            
            if project_count >= limit:
                raise ValidationError({"detail": f"You have reached your limit of {limit} projects. Please upgrade your plan."})
            
            # Auto-assign the created project to the current user
            serializer.save(user=user)
