"use client";
import { useState } from "react";
import { UserRegistrationForm } from "./forms/FormStructures";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";

export default function NewUserForm({ roles, setUsersData }) {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    PasswordHash: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.FullName.trim()) {
      newErrors.FullName = "Full Name is required";
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.Email)) {
      newErrors.Email = "Invalid email format";
    }

    if (!formData.PasswordHash.trim()) {
      newErrors.PasswordHash = "Password is required";
    } else if (formData.PasswordHash.length < 6) {
      newErrors.PasswordHash = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.PasswordHash)) {
      newErrors.PasswordHash = "Password must contain at least one uppercase letter and one number";
    }

    if (!formData.role_id) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await HandleUsers({
        mode: "find",
        item_type: "users",
        data: { Email: formData.Email },
      });

      if (res[0]?.email_exists) {
        setErrorMessage("Email already exists");
        setTimeout(() => setErrorMessage(""), 3000);
      } else {
        await HandleUsers({
          mode: "insert",
          item_type: "users",
          data: formData,
        });

        setSuccessMessage("User created successfully");
        setFormData({
          FullName: "",
          Email: "",
          PasswordHash: "",
          role_id: "",
        });

        const users_res = await HandleUsers({ mode: "get", item_type: "users", data: { Email: null } });
        setUsersData(users_res);

        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (error) {
      setErrorMessage("An error occurred while processing your request.");
      setTimeout(() => setErrorMessage(""), 2000);
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 w-[50%] rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Add new user</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {UserRegistrationForm.map((input, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium mb-1">{input.title}</label>
            {input.type === "select" ? (
              <select
                name={input.field}
                value={formData[input.field]}
                onChange={handleChange}
                required={input.required}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                name={input.field}
                value={formData[input.field]}
                onChange={handleChange}
                required={input.required}
                className="p-2 border border-gray-300 rounded"
              />
            )}
            {errors[input.field] && <span className="text-red-500">{errors[input.field]}</span>}
          </div>
        ))}
        <button
          type="submit"
          className="bg-orange-400 text-white text-lg font-bold py-2 rounded hover:bg-orange-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {errorMessage && <div className="mt-4 text-red-500 font-semibold">{errorMessage}</div>}
      {successMessage && <div className="mt-4 text-green-500 font-semibold">{successMessage}</div>}
    </div>
  );
}
