export async function verifyYocoPayment(paymentId: string): Promise<boolean> {
  const yocoSecretKey = process.env.YOCO_SECRET_KEY;
  if (!yocoSecretKey) throw new Error("YOCO_SECRET_KEY not set");

  const res = await fetch(`https://payments.yoco.com/api/checkouts/${paymentId}`, {
    headers: { Authorization: `Bearer ${yocoSecretKey}` },
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.status === "successful";
}
