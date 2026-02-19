import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Page</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This is a test page.
          </p>
        </div>
      </div>
    </div>
  );
}
