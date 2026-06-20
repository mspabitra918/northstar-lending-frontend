import { Suspense } from "react";
import DocumentsContent from "./DocumentsContent";

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
