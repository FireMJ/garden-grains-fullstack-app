'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function TestImagePage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  const testImages = [
    { src: '/images/soups/creamy_butternut.jpeg', name: 'Creamy Butternut Soup' },
    { src: '/images/soups/creamy_sweet_potato.jpg', name: 'Creamy Sweet Potato Soup' },
    { src: '/images/toasties/bacon_egg_cheese.jpg', name: 'Bacon Egg Cheese Toastie' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testImages.map((img, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <Image
                  src={img.src}
                  alt={img.name}
                  fill
                  className="object-cover"
                  unoptimized
                  onLoad={() => addLog(`✅ Loaded: ${img.src}`)}
                  onError={() => addLog(`❌ Failed: ${img.src}`)}
                />
              </div>
              <p className="text-center font-medium">{img.name}</p>
              <p className="text-center text-xs text-gray-500 mt-1">{img.src}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Logs:</h3>
          <div className="text-xs font-mono space-y-1 max-h-60 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className={log.includes('✅') ? 'text-green-600' : log.includes('❌') ? 'text-red-600' : 'text-gray-600'}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
