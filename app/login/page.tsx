"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth-actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full bg-black text-white p-3 font-bold border-2 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
    >
      {pending ? "Authenticating..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="bg-white p-8 border-2 border-black shadow-neo w-full max-w-md relative">
        
        <div className="absolute top-0 right-0 w-8 h-8 bg-black clip-path-polygon-[0_0,100%_0,100%_100%]"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-highlight px-4 py-1 border-2 border-black font-black text-sm transform -rotate-2 mb-4">
            TASK MASTER
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Welcome Back</h1>
          <p className="text-neutral-500 font-medium mt-2">Enter your credentials to continue</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          
          <div className="space-y-1">
            <label className="font-bold text-sm ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="admin@workforward.com"
              className="w-full bg-neutral-50 border-2 border-black p-3 outline-none focus:shadow-neo transition-all font-medium" 
              required 
            />
          </div>

          <div className="space-y-1">
             <label className="font-bold text-sm ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-neutral-50 border-2 border-black p-3 outline-none focus:shadow-neo transition-all font-medium" 
              required 
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-600 p-3 text-sm font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
          Secure Login System
        </div>
      </div>
    </div>
  );
}