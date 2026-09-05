import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { Login } from './features/auth/pages/Login';
import { Signup } from './features/auth/pages/Signup';
import { ForgotPassword } from './features/auth/pages/ForgotPassword';
import { ResetPassword } from './features/auth/pages/ResetPassword';
import { MagicLinkVerify } from './features/auth/pages/MagicLinkVerify';

// Core Pages
import { Dashboard } from './features/dashboard/pages/Dashboard';
import { Settings } from './features/settings/pages/Settings';
import { Billing } from './features/billing/pages/Billing';
import { NotFound } from './features/misc/pages/NotFound';

const Landing = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <h1 className="text-4xl font-bold mb-4">SaaS App</h1>
    <p className="text-muted-foreground mb-8">Your next generation SaaS platform.</p>
    <a href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
      Get Started
    </a>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/magic-link/verify" element={<MagicLinkVerify />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><AppLayout><Billing /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
