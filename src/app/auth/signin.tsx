// pages/auth/signin.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email: form.email, password: form.password });
    setLoading(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" />
        <input required placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-[#1E4259] text-white py-2 rounded">{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}
