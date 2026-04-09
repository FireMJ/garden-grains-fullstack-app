import { Suspense } from "react";
import CancelContent from "./CancelContent";

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
