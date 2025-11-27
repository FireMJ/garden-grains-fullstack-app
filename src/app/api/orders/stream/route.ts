import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, DocumentData } from "firebase/firestore";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Firestore query: orders ordered by createdAt descending
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

      // Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map((doc: DocumentData) => ({
          id: doc.id,
          ...doc.data(),
        }));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(orders)}\n\n`));
      }, (error) => {
        console.error("Firestore stream error:", error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`));
      });

      // Cleanup when client disconnects
      const close = () => {
        unsubscribe();
        controller.close();
      };

      req.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}