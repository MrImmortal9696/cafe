"use client";
import { useState } from "react";
import { HandleCustomer } from "@/libs/apifunctions/handleCustomer";
import { CustomerRegistrationForm } from "@/app/admin/components/users/forms/FormStructures";
import { useRouter } from "next/navigation";
import { EmailSender } from "@/libs/emailjs/EmailSubmit";

export default function RegistrationForm({ postRegPath }) {
  const [formData, setFormData] = useState({
    CustomerName: "",
    CustomerEmail: "",
    Phone: "",
    Customer_Password: "",
    ConfirmPassword: "",
  });

  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "CustomerEmail" ? value.toLowerCase() : value,
    }));
  };

  const validateForm = () => {
    if (!formData.CustomerName.trim()) {
      setError("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.CustomerEmail)) {
      setError("Invalid email format");
      return false;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(formData.Phone)) {
      setError("Phone number must be 10 to 11 digits");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.Customer_Password)) {
      setError("Password must be at least 6 characters, include 1 uppercase letter & 1 number");
      return false;
    }

    if (formData.Customer_Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError(""); // Clear error if validation passes
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return; 

    setLoading(true);
    setError("");

    try {
      const userExists = await HandleCustomer({
        mode: "find",
        item_type: "customer",
        data: { CustomerEmail: formData.CustomerEmail },
      });

      if (userExists !== null) {
        setError("A user with this email already exists.");
        setLoading(false);
        return;
      }

      await HandleCustomer({
        mode: "register",
        item_type: "customer",
        data: formData,
      });

       EmailSender({
            formData:{
              Name:formData.CustomerName,
              Email:formData.CustomerEmail,
              Password:formData.Customer_Password},
            subject_purpose:"Registration",
            })


      alert("Registration successful!");
      setFormData({
        CustomerName: "",
        CustomerEmail: "",
        Phone: "",
        Customer_Password: "",
        ConfirmPassword: "",
      });

   

      postRegPath && router.push(postRegPath);

    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex-center">
      <div className="w-[400px] mx-auto shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Customer Registration</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          {CustomerRegistrationForm.map((field) => (
            <div key={field.field} className="mb-4">
              <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">
                {field.title}
              </label>
              <input
                type={field.type}
                id={field.field}
                name={field.field}
                value={formData[field.field]}
                onChange={handleChange}
                required={field.required}
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="ConfirmPassword"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
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
              {loading ? "Registering..." : "Register"}
            </button>
            <a href="/login" className="font-semibold text-end w-full mt-4">
              Go to Login?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
