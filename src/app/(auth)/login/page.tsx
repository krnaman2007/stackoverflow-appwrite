// "use client"

// import { useAuthStore } from '@/store/Auth'
// import React from 'react'

// function LoginPage() {

//     const {login}=useAuthStore()
//     const [isLoading, setIsLoading]=React.useState(false)
//     const [error,setError]=React.useState("")

//     const handleSubmit=async (e: React.FormEvent<HTMLFormElement>)=>{
//         e.preventDefault()

//         //collect data
//         const formData=new FormData(e.currentTarget)
//         const email=formData.get("email")
//         const password=formData.get("password")

//         //validation
//         if(!email || !password){
//             setError(()=>"Please fill all fields")
//             return
//         }

//         //handle loading and errors
//         setIsLoading(()=>true)
//         setError(()=>"")

//         //login => store

//         const loginResponse=await login(email.toString(),password.toString())

//         if(loginResponse.error){
//             setError(()=>loginResponse.error!.message)
//         }
//         setIsLoading(()=>false)
//     }

//   return (
//     <div>LoginPage</div>
//   )
// }

// export default LoginPage
"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IconCode, IconLoader2, IconLock, IconMail } from "@tabler/icons-react";

export default function LoginPage() {
  const { login, session } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (session) router.push("/");
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    const loginResponse = await login(email.toString(), password.toString());
    if (loginResponse.error) {
      setError(loginResponse.error.message);
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
          <IconCode size={20} className="text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">
          Stack<span className="text-primary">Flow</span>
        </span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <h1 className="text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <IconMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <IconLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading && <IconLoader2 size={15} className="animate-spin" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}