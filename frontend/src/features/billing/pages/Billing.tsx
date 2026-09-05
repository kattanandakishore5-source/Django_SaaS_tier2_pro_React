import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useSubscription, useCheckout } from '../hooks';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import { queryKeys } from '../../../api/queryKeys';

export const Billing: React.FC = () => {
  const { data, isLoading, isError } = useSubscription();
  const checkout = useCheckout();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const status = searchParams.get('checkout');
    if (status === 'success') {
      toast({ type: 'success', title: 'Checkout successful!' });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
      searchParams.delete('checkout');
      setSearchParams(searchParams);
    } else if (status === 'cancel') {
      toast({ type: 'info', title: 'Checkout cancelled.' });
      searchParams.delete('checkout');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, toast, queryClient]);

  const handleCheckout = (planId: string) => {
    checkout.mutate(planId, {
      onSuccess: (res) => {
        window.location.href = res.checkout_url;
      },
      onError: () => {
        toast({ type: 'error', title: 'Failed to initiate checkout.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h2>
        <p className="text-muted-foreground mt-2">
          Manage your subscription plan and payment methods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              {isLoading ? (
                <Skeleton className="h-4 w-48 mt-1" />
              ) : isError ? (
                <span className="text-destructive">Failed to load subscription status.</span>
              ) : (
                <>You are currently on the <span className="font-semibold text-foreground uppercase">{data?.subscription?.price_id || 'Free'}</span> plan.</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.has_active_subscription ? (
              <div className="space-y-4">
                <div className="text-sm">
                  Status: <span className="capitalize font-medium">{data.subscription?.status}</span>
                </div>
                {data.subscription?.cancel_at_period_end && (
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    Your subscription will cancel at the end of the current billing period.
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  (Note: Management portal is handled via the backend.)
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Upgrade to a Pro plan to unlock advanced features, increased limits, and priority support.
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleCheckout('basic')} 
                    disabled={checkout.isPending}
                    variant="outline"
                  >
                    {checkout.isPending ? 'Loading...' : 'Subscribe Basic'}
                  </Button>
                  <Button 
                    onClick={() => handleCheckout('pro')} 
                    disabled={checkout.isPending}
                  >
                    {checkout.isPending ? 'Loading...' : 'Subscribe Pro'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your saved credit cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[100px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No payment methods available.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

