"use client";

import { useState } from "react";

// Test individual components
function TestComponent({ name, component }: { name: string; component: React.ReactNode }) {
  const [isError, setIsError] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold mb-2">Testing: {name}</h3>
      <div className={isError ? "bg-red-100 p-2 rounded" : "bg-green-100 p-2 rounded"}>
        {isError ? "❌ Error loading component" : component}
      </div>
    </div>
  );
}

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Component Debug Page</h1>
      
      <div className="grid gap-4">
        <TestComponent name="Basic HTML" component={<div>✅ Basic HTML works</div>} />
        
        <TestComponent 
          name="Basic React State" 
          component={
            <div>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => alert('React works!')}
              >
                Test React
              </button>
            </div>
          } 
        />
        
        {/* Add more component tests one by one */}
      </div>
    </div>
  );
}