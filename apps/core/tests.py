from django.test import TestCase, Client
from rest_framework.test import APIClient
from apps.accounts.models import CustomUser
from apps.billing.models import Subscription
from apps.core.models import Project
from apps.billing.entitlements import PLAN_FREE, PLAN_BASIC, PLAN_PRO, LIMIT_PROJECTS, PLAN_LIMITS

class EntitlementsAndLimitsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_free = CustomUser.objects.create_user(email='free@example.com', password='pw')
        self.user_basic = CustomUser.objects.create_user(email='basic@example.com', password='pw')
        self.user_pro = CustomUser.objects.create_user(email='pro@example.com', password='pw')
        
        Subscription.objects.create(user=self.user_basic, stripe_subscription_id='sub_1', stripe_price_id='price_basic_test', status='active')
        Subscription.objects.create(user=self.user_pro, stripe_subscription_id='sub_2', stripe_price_id='price_pro_test', status='active')

    def test_free_limit(self):
        self.client.force_authenticate(user=self.user_free)
        # Create 1 project (limit is 1)
        res = self.client.post('/api/projects/', {'name': 'Proj 1'})
        self.assertEqual(res.status_code, 201)
        
        # Second should fail
        res = self.client.post('/api/projects/', {'name': 'Proj 2'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('limit', str(res.data))

    def test_basic_limit(self):
        self.client.force_authenticate(user=self.user_basic)
        for i in range(PLAN_LIMITS[PLAN_BASIC][LIMIT_PROJECTS]):
            res = self.client.post('/api/projects/', {'name': f'Proj {i}'})
            self.assertEqual(res.status_code, 201)
        
        # Next should fail
        res = self.client.post('/api/projects/', {'name': 'Proj extra'})
        self.assertEqual(res.status_code, 400)

    def test_entitlements_api(self):
        self.client.force_authenticate(user=self.user_pro)
        res = self.client.get('/billing/api/billing/entitlements/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['plan'], PLAN_PRO)
        self.assertEqual(res.data['limits']['projects'], PLAN_LIMITS[PLAN_PRO][LIMIT_PROJECTS])
        self.assertIn('advanced_charts', res.data['features'])
