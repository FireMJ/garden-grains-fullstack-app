'use client';

import { useState, useEffect } from 'react';
import { visitCounterService } from '@/services/visitCounterService';
import { FaUsers, FaEye, FaCalendarDay } from 'react-icons/fa';

export default function LiveVisitCounter() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      setStats({
        totalVisits: visitCounterService.getTotalVisits(),
        uniqueVisitors: visitCounterService.getUniqueVisitors(),
        todayVisits: visitCounterService.getTodayVisits(),
      });
    };
    
    updateStats();
    
    // Listen for new visits
    const handleVisitTracked = () => updateStats();
    window.addEventListener('visitTracked', handleVisitTracked);
    
    return () => window.removeEventListener('visitTracked', handleVisitTracked);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaEye className="text-green-600" />
            <span className="font-semibold">{stats.totalVisits}</span>
            <span className="text-gray-500">total views</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            <span className="font-semibold">{stats.uniqueVisitors}</span>
            <span className="text-gray-500">visitors</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <FaCalendarDay className="text-orange-600" />
            <span className="font-semibold">{stats.todayVisits}</span>
            <span className="text-gray-500">today</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
