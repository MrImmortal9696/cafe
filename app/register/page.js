// pages/registration.js

"use client";
import RegistrationForm from "../components/landing/RegistrationForm";
export default function RegistrationPage() {
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <RegistrationForm  postRegPath={'/login'}/> {/* Use the RegistrationForm component */}
    </div>
  );
}
