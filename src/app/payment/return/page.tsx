import { Suspense } from 'react';
import ReturnContent from './ReturnContent';

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment return...</p>
        </div>
      </div>
    }>
      <ReturnContent />
    </Suspense>
  );
}
