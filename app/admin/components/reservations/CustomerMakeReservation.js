"use client";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useEffect, useState } from "react";
import { AddCustomerReservationForm } from "./forms/FormStructures";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { HandleReservation } from "@/libs/apifunctions/handleReservation";
import BannerTextHorizontal from "@/app/components/landing/BannerTextHorizontal";
import { useSession } from "next-auth/react";
import { getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";

export default function CustomerMakeReservation({ 
  setNewReservation, 
  tablesList, 
  selectedTables, 
  setSelectedTables,
  setTablesData,
  setReservationData,
  setShowTables,
  newReservationForm, 
  setNewReservationForm
}) {
  const { data: session } = useSession();
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setNewReservationForm((prevForm) => ({
      ...prevForm,
      selectedTables: selectedTables,
      TableID_list: selectedTables.map((table) => table.TableID),
    }));
  }, [selectedTables]);

  useEffect(() => {
    if (session?.user?.role === "customer") {
      setNewReservationForm((prev) => ({
        ...prev,
        CustomerEmail: session?.user?.email,
        CustomerName: session?.user?.name,
        CustomerPhone: session?.user?.phone,
      }));
    }
  }, [session]);

  const handleFormFill = (field, value) => {
    setNewReservationForm((prev) => ({ ...prev, [field]: value }));
    if (field !== "Preferences") {
      validateField(field, value);
    }
  };

  const validateField = (field, value) => {
    let errors = { ...formErrors };
    if (!value || value.toString().trim() === "") {
      errors[field] = "This field is required";
    } else {
      delete errors[field];
    }

    if (field === "CustomerEmail" && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        errors[field] = "Invalid email format";
      }
    }

    if (field === "CustomerPhone" && value) {
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(value)) {
        errors[field] = "Phone number must be 10-11 digits";
      }
    }

    if (field === "NumberOfGuests" && value) {
      const guests = parseInt(value, 10);
      if (guests < 1 || guests > 22) {
        errors[field] = "Number of guests must be between 1 and 22";
      }
    }

    setFormErrors(errors);
  };

  const isFormValid = () => {
    return AddCustomerReservationForm.every(({ field }) => 
      field === "Preferences" || (!formErrors[field] && newReservationForm[field])
    );
  };

  return (
    <div className="flex flex-col justify-center gap-2 h-full">
      <div className="w-[90%] mx-auto text-center">
        <BannerTextHorizontal
          top="Reservation"
          heading="Book your choice of Tables"
          description=""
          button1Text="TABLE ORDER"
          button1Link="/reservation"
          button2Text=""
          button2Link="/online-shop"
        />
      </div>

      <form className="h-[50%] w-full rounded-md flex justify-end flex-col gap-4">
        <div className="lg:w-full w-[90%] mx-auto p-4 lg:grid lg:grid-cols-3 flex items-center flex-col gap-4">
        {AddCustomerReservationForm.map(({ title, field, type, span, min, max }, index) => {
  // Determine min values dynamically
  
          const isDateField = field === "ReservationDate";
          const isTimeField = field === "ReservationTime";
          const today = getLocalDate_YMD();
          const now = getLocalTime();
          const selectedDate = newReservationForm["ReservationDate"] || today;
          const minTime = selectedDate === today ? now : "00:00";

          // Ensure ReservationTime is valid when ReservationDate changes
          useEffect(() => {
            if (newReservationForm["ReservationDate"] === today && newReservationForm["ReservationTime"] < now) {
              handleFormFill("ReservationTime", now);
            }
          }, [newReservationForm["ReservationDate"]]);

          return (
            <div key={index} className={`flex w-full flex-col gap-2 ${span ? `col-span-${span}` : ""}`}>
              <label className="font-semibold">{title}</label>
              {field === "Preferences" ? (
                <textarea
                  value={newReservationForm[field] || ""}
                  onChange={(e) => handleFormFill(field, e.target.value)}
                  className="py-2 bg-orange-100 px-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  rows="4"
                />
              ) : (
                <input
                  type={type}
                  value={newReservationForm[field] || ""}
                  onChange={(e) => handleFormFill(field, e.target.value)}
                  className="py-2 px-2 bg-orange-100 rounded-lg border w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  {...(type === "number" ? { min, max } : {})}
                  {...(isDateField ? { min: today } : {})} // Prevent past dates
                  {...(isTimeField ? { min: minTime } : {})} // Prevent past times if today is selected
                />
              )}
              {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
            </div>
          );
        })}


                </div>
              </form>

              <div className="w-[95%] mx-auto flex justify-end">
                <button
                  onClick={() => setShowTables((prev) => !prev)}
                  disabled={!isFormValid()}
                  className={`w-[100px] text-center col-span-1 py-2 rounded-lg focus:outline-none ${
                    isFormValid() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
  );
}
