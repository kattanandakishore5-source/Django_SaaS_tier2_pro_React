import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVerifyMagicLink } from '../hooks';
import type { ApiError } from '../../../types';

export const MagicLinkVerify: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const verifyMutation = useVerifyMagicLink();
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (token && !hasAttempted.current) {
      hasAttempted.current = true;
      verifyMutation.mutate(token, {
        onSuccess: (res) => {
          if (res.pending_2fa) {
            navigate('/login', { state: { message: 'Please login to complete 2FA.' } });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      });
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border text-center">
          <div className="text-destructive font-semibold mb-4">Invalid Magic Link</div>
          <p className="text-muted-foreground mb-6">The magic link is invalid or missing from the URL.</p>
          <Link to="/login" className="text-primary hover:underline">Return to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm border text-center">
        {verifyMutation.isPending && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" role="status" aria-label="Verifying"></div>
            <p className="text-muted-foreground">Verifying your magic link...</p>
          </div>
        )}
        
        {verifyMutation.isError && (
          <div>
            <div className="text-destructive font-semibold mb-4">Verification Failed</div>
            <p className="text-muted-foreground mb-6">
              {(verifyMutation.error as unknown as ApiError).message || 'This magic link has expired or is invalid.'}
            </p>
            <Link to="/login" className="text-primary hover:underline">Return to login</Link>
          </div>
        )}
      </div>
    </div>
  );
};
