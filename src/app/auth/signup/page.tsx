"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SignUpPage() {
  const router = useRouter();
  const { signInWithGoogle } = useGoogleSignIn();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      let photoURL = "";
      if (image) {
        const imgRef = ref(storage, `users/${user.uid}/${image.name}`);
        await uploadBytes(imgRef, image);
        photoURL = await getDownloadURL(imgRef);
      }

      await updateProfile(user, { displayName: name, photoURL });
      toast.success("Account created!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-1/4 bg-gray-300"></span>
          <span className="text-gray-500 text-sm">or</span>
          <span className="h-px w-1/4 bg-gray-300"></span>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-100 transition"
        >
          <img src="/icons/google.svg" alt="Google" className="h-5 w-5 mr-2" />
          Continue with Google
        </button>

        <Link
          href="/auth/phone"
          className="block text-center text-green-700 hover:underline text-sm"
        >
          Sign up with Phone
        </Link>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-green-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
