# Entitlements & Access Control

This boilerplate enforces a **Strict Server-Authoritative** entitlement system.

## The Rule of Thumb
**Never trust the frontend.** The frontend only *displays* UI gates. The backend *enforces* the rules and limits. 

## Defining Features and Limits
All entitlements are defined in `apps/billing/entitlements.py`.

```python
PLAN_FEATURES = {
    PLAN_FREE: set(),
    PLAN_BASIC: {FEATURE_BASIC_ANALYTICS, FEATURE_USER_MANAGEMENT},
    PLAN_PRO: {FEATURE_BASIC_ANALYTICS, FEATURE_USER_MANAGEMENT, FEATURE_ADVANCED_CHARTS},
}

PLAN_LIMITS = {
    PLAN_FREE: {LIMIT_PROJECTS: 1},
    PLAN_BASIC: {LIMIT_PROJECTS: 5},
    PLAN_PRO: {LIMIT_PROJECTS: 1000},
}
```

## Backend Enforcement
### 1. Feature Enforcement (Views/APIs)
Use the `HasFeatureAccess` DRF permission:
```python
from apps.billing.entitlements import HasFeatureAccess

class AdvancedChartsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, HasFeatureAccess('advanced_charts')]
```

### 2. Limit Enforcement (Resource Creation)
Check limits inside a database transaction to prevent concurrent race conditions:
```python
def perform_create(self, serializer):
    with transaction.atomic():
        user = CustomUser.objects.select_for_update().get(id=self.request.user.id)
        if Project.objects.filter(user=user).count() >= get_user_limit(user, 'projects'):
            raise ValidationError("Limit reached.")
        serializer.save(user=user)
```

## Frontend Integration
The frontend automatically fetches the user's allowed features and limits from `GET /billing/api/billing/entitlements/`.

To gate a UI component in React, use the `<FeatureGate>` wrapper:
```tsx
import { FeatureGate } from '@/components/ui/FeatureGate';

<FeatureGate feature="advanced_charts">
  <AdvancedChartComponent />
</FeatureGate>
```
If the user lacks the feature, they will see an "Upgrade to Unlock" prompt.
