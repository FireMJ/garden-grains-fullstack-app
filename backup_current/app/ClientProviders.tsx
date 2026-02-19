import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import React from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
