// components/LoginForm.js

"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react"; // For signIn and signOut
import { useRouter } from "next/navigation"; // For redirecting after successful login

const LoginForm = ({ setShowModal,path,setShowLogin,showLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession(); // To get the current session
  const router = useRouter(); // For redirecting after login

  useEffect(() => {
    if (session && !showLogin ) {
      window.location.href("/"); // Redirect to the home/dashboard if user is already logged in
    }
  }, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new submission

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
        { setShowModal &&
            setShowModal(false)
        } // Close modal on successful login
      window.location.href=path || "/" // Redirect to the page you want to go after login
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out user without redirect
    router.push("/login"); // Redirect to login page after sign-out
  };

  // If the user is already logged in, display a sign-out option
  

  // If the user is not logged in, show the login form
  return (
    <div className="lg:w-[400px] w-full mx-auto shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Login {path}</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <a href="/register" className="font-semibold text-end w-full mt-4">
            Go to Registration?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
