'use client';

import { useEffect } from 'react';
import { visitCounterService } from '@/services/visitCounterService';

export default function VisitTracker() {
  useEffect(() => {
    // Track the visit when component mounts
    visitCounterService.trackVisit();
  }, []);
  
  return null;
}
