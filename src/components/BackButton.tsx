'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export default function BackButton({ fallbackHref = '/menu', label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
    >
      <FaArrowLeft className="text-sm" />
      <span>{label}</span>
    </button>
  );
}
