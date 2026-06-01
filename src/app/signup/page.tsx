import { Suspense } from 'react';
import SignupClient from './SignupClient';

export const metadata = {
  title: 'Sign Up | Garden & Grains',
  description: 'Create your Garden & Grains account and get 20% off your first order',
};

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SignupClient />
    </Suspense>
  );
}
