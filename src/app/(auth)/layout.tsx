// "use client"

// import { useAuthStore } from "@/store/Auth"
// import { useRouter } from "next/navigation"
// import React,{useEffect} from "react"

// const Layout=({children}: {children: React.ReactNode})=>{
//     const {session}=useAuthStore()
//     const router=useRouter()

//     //Agar user already logged in hai toh usse yahan aane hi nahi dena
//     React.useEffect(()=>{
//         if(session){
//             router.push("/")
//         }
//     },[session,router])

//     if(session){
//         return null
//     }

//     return (
//         <div>
//             <div>
//                 {children}
//             </div>
//         </div>
//     )
// }

// export default Layout
"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) return null;

  return <>{children}</>;
};

export default Layout;