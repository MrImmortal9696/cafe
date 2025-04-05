// pages/login.js

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // For getting the session
import { useRouter } from "next/navigation"; // For redirecting after successful login
import LoginForm from "../components/landing/LoginForm";
export default function LoginPage() {
  const { data: session } = useSession(); // To get the current session
  const router = useRouter(); // For redirecting after login

  useEffect(() => {
    if (session) {
      router.push("/"); // If user is logged in, redirect to home/dashboard
    }
  }, [session, router]);

  if (session) {
    // If user is logged in, show the sign-out page
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div className="w-[400px] mx-auto shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Logged in as {session.user.name}</h2>
          <button
            onClick={() => signOut({ redirect: false })}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // If the user is not logged in, show the login form
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
