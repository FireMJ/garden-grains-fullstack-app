// src/app/profile/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState<{type:"success"|"error"|""; text: string}>({type:"", text:""});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/profile");
      const data = await res.json();
      setUser(data.user);
      setForm({ name: data.user?.name ?? "", phone: data.user?.phone ?? "" });
      setLoading(false);
    };
    load();
  }, [session]);

  const save = async () => {
    setMessage({type:"", text:""});
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUser(data.user);
      setEditMode(false);
      setMessage({type:"success", text:"Profile updated"});
    } catch (err: any) {
      setMessage({type:"error", text: err.message || "Update failed"});
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">No profile found</div>;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

        {message.text && <div className={`mb-4 p-3 rounded ${message.type==="success"?"bg-green-50 text-green-700":"bg-red-50 text-red-700"}`}>{message.text}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="mt-1 block w-full border rounded p-2" disabled={!editMode} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="mt-1 block w-full border rounded p-2" disabled={!editMode} />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {editMode ? (
            <>
              <button onClick={save} className="bg-[#1E4259] text-white px-4 py-2 rounded">Save</button>
              <button onClick={()=>{setEditMode(false); setForm({name:user.name, phone:user.phone})}} className="px-4 py-2 rounded border">Cancel</button>
            </>
          ) : (
            <button onClick={()=>setEditMode(true)} className="bg-[#1E4259] text-white px-4 py-2 rounded">Edit profile</button>
          )}
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="text-lg font-semibold mb-2">Order history</h2>
          <UserOrders userId={user.id} />
        </div>
      </div>
    </main>
  );
}

function UserOrders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [userId]);

  if (!orders.length) return <p className="text-gray-500">No past orders yet.</p>;

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="p-3 border rounded">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">Order {o.id}</div>
              <div className="text-xs text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm font-semibold">{o.status}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
