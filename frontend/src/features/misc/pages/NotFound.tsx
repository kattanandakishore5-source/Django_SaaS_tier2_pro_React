import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-8">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-muted-foreground max-w-[500px] mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved, 
        deleted, or perhaps you mistyped the URL.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/"
          className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2')}
        >
          Return Home
        </Link>
        <Link 
          to="/dashboard"
          className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2')}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
