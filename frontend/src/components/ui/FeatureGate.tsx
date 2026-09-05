import React from 'react';
import { useEntitlements } from '../../features/billing/hooks';
import { Skeleton } from './Skeleton';
import { Lock } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback }) => {
  const { data, isLoading, isError } = useEntitlements();

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  if (isError || !data?.features.includes(feature)) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    
    // Default locked state
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/30">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium">Feature Locked</h3>
        <p className="text-sm text-muted-foreground">
          Your current plan ({data?.plan || 'free'}) does not include access to {feature.replace('_', ' ')}.
          Upgrade to unlock this feature.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
