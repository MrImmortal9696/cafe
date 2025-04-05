"use client";
import React, { useState } from "react";
import emailjs from "emailjs-com";
import BannerTextHorizontal from "./BannerTextHorizontal";

import { PiMailboxFill } from "react-icons/pi";
import { EmailSender } from "@/libs/emailjs/EmailSubmit";
// HTML generation functions for the emails
const generateHtmlContent = (formData) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Contact Form Submission</h2>
        <p><strong>First Name:</strong> ${formData.firstName}</p>
        <p><strong>Last Name:</strong> ${formData.lastName}</p>
        <p><strong>Contact:</strong> ${formData.contact}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      </body>
    </html>
  `;
};

const generateWelcomeHtmlContent = (formData) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <header style="background-color: #007BFF; color: #fff; padding: 15px; text-align: center;">
            <h2 style="margin: 0; font-size: 1.5rem;">Welcome to Tropical Cafe</h2>
          </header>
          <footer style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 0.9rem; color: #555;">
            <p style="margin: 0;">Thank you for reaching out to Tropical Cafe.</p>
          </footer>
        </div>
      </body>
    </html>
  `;
};

export default function ContactUs({ email = "tropicalcafe55@gmail.com" }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false); // For handling loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true during submission

    EmailSender({
      formData,
      adminSubject: "New Order Received!",
      userSubject: "Thank You for Your Order!",
      adminTemplateId: "template_admin123",
      userTemplateId: "template_user456",
      adminHtmlContent:generateHtmlContent(formData),
      userHtmlContent:generateWelcomeHtmlContent(formData)
      })
  };

  const inputClass =
    "bg-[#F59D12] bg-opacity-20 lg:w-[400px] w-full rounded-lg px-4 py-2 ";

  return (
    <div className=" min-h-[70vh] mx-auto bg-white p-6 rounded-b-[20px] flex flex-col justify-between ">
      <div className="lg:w-1/2 py-4 w-[90%] text-center mx-auto">
        <BannerTextHorizontal
          top="Contact Us"
          heading="We are always just a call away"
          description="We’d love to hear from you! Whether you have a question, feedback, or just want to know more about Tropical Café, we're here to help. Fill out the form below and we’ll get back to you as soon as possible."
          button1Text="Read More"
        />
      </div>
      <div className="mx-auto lg:w-[80%] w-full  ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:items-center items-start  gap-4"
        >
          <div className="grid w-full lg:w-auto lg:grid-cols-2 grid-cols-1 gap-4">
            {[
              {
                label: "First Name",
                name: "firstName",
                type: "text",
                value: formData.firstName,
              },
              {
                label: "Last Name",
                name: "lastName",
                type: "text",
                value: formData.lastName,
              },
              {
                label: "Contact",
                name: "contact",
                type: "text",
                value: formData.contact,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
              },
            ].map((field) => (
              <div key={field.name} className="gap-2 w-full  flex-shrink-0">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <div className=" w-full lg:w-auto flex-shrink-0 flex-col-center">
            <div className="mb-4  w-full">
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={`${inputClass} h-32`}
              />
            </div>
            <div className="flex-center">
              <button
                type="submit"
                className={`w-[200px] h-[50px] mx-auto mt-4 text-white font-semibold rounded-lg ${
                  loading
                    ? "bg-[#F59D12] bg-opacity-20 cursor-not-allowed"
                    : "bg-[#F59D12]"
                }`}
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <span className="flex-center gap-4 text-[20px]">
                    Send <PiMailboxFill className="text-[28px]" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
