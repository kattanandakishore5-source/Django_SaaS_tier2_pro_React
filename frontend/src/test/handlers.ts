import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:8000';

export const handlers = [
  http.get(`${BASE_URL}/api/projects/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: 'Test Project',
          description: 'A test project',
          user: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  }),
  
  http.get(`${BASE_URL}/api/dashboard/stats/`, () => {
    return HttpResponse.json(
      { error: "Forbidden", details: { detail: ["You do not have permission to perform this action."] } },
      { status: 403 }
    );
  }),

  http.get(`${BASE_URL}/billing/api/billing/entitlements/`, () => {
    return HttpResponse.json({
      plan: 'pro',
      features: ['basic_analytics', 'user_management', 'advanced_charts'],
      limits: { projects: 1000 }
    });
  }),

  http.get(`${BASE_URL}/billing/api/billing/subscription/`, () => {
    return HttpResponse.json({
      has_active_subscription: false,
      subscription: null
    });
  }),

  http.post(`${BASE_URL}/billing/api/billing/checkout/`, async ({ request }) => {
    const { plan_id } = await request.json() as any;
    if (plan_id === 'basic' || plan_id === 'pro') {
      return HttpResponse.json({
        checkout_url: 'https://checkout.stripe.com/mock-session',
        session_id: 'cs_mock_123'
      });
    }
    return HttpResponse.json({ error: "Invalid plan" }, { status: 400 });
  })
];
