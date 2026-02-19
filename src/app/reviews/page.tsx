"use client";

import Header from "@/components/Header";

export default function ReviewsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <p className="text-gray-600">Reviews content will be here.</p>
          </div>
        </div>
      </div>
    </>
  );
}
