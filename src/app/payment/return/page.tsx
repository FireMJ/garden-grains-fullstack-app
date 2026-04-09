import { Suspense } from "react";
import ReturnContent from "./ReturnContent";

export default function ReturnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnContent />
    </Suspense>
  );
}
