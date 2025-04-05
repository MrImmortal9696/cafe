"use client";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useEffect, useState } from "react";
import { AddReservationForm } from "./forms/FormStructures";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { HandleReservation } from "@/libs/apifunctions/handleReservation";
import { getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";

export default function MakeReservation({ 
  setNewReservation, 
  tablesList, 
  selectedTables, 
  setSelectedTables,
  setTablesData,
  setReservationData,
  newReservationForm, 
  setNewReservationForm
}) {

  useEffect(() => {
    setNewReservationForm((prevForm) => ({
      ...prevForm,
      selectedTables: selectedTables,
      TableID_list: selectedTables.map((table) => table.TableID),
    }));
  }, [selectedTables]);

  const handleFormFill = (field, value) => {
    setNewReservationForm({ ...newReservationForm, [field]: value });
  };

  const handleUnSelectTable = (item) => {
    setSelectedTables((prevTables) =>
      prevTables.filter((table) => table.TableID !== item.TableID)
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
  
    if (
      !newReservationForm.ReservationDate ||
      !newReservationForm.ReservationTime ||
      !newReservationForm.CustomerName ||
      !newReservationForm.CustomerEmail ||
      !newReservationForm.CustomerPhone ||
      !newReservationForm.NumberOfGuests ||
      selectedTables.length === 0
    ) {
      alert("Please fill in all required fields and select at least one table.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newReservationForm.CustomerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(newReservationForm.CustomerPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }
  
    if (
      newReservationForm.NumberOfGuests < 1 ||
      newReservationForm.NumberOfGuests > 22
    ) {
      alert("Number of guests must be between 1 and 22.");
      return;
    }

    if (selectedTables.length === 0) {
      alert("Please select at least one table.");
      return;
    }
  
    console.log("New Reservation Data:", newReservationForm);
  
    const res = await HandleReservation({
      mode: "insert",
      item_type: "Reservations",
      data: newReservationForm,
    });
  
    console.log({ res });
  
    const updated_res = await HandleUsers({
      mode: "get",
      item_type: "reservedTables",
      data: {
        ReservationDate: newReservationForm.ReservationDate,
        ReservationTime: newReservationForm.ReservationTime,
      },
    });
  
    setTablesData(updated_res);
    setReservationData(res.updated_data.reservations);
  
    setSelectedTables([]);
    setNewReservationForm({
      ReservationDate: getLocalDate_YMD(),
      ReservationTime: getLocalTime(),
      selectedTables: [],
      TableID_list: [],
      Reservation_type: "reserved",
    });
  }
  
  return (
    <form
      className="h-full w-full  rounded-md shadow-md flex flex-col gap-1"
      onSubmit={handleSubmit}
    >
      <div className="w-full p-4 grid grid-cols-3 gap-1">
       {AddReservationForm.map(({ title, field, type, span, min, max }, index) => (
               <div key={index} className={`flex w-full flex-col gap-2 ${span ? `col-span-${span}` : ""}`}>
                 <label className="font-semibold">{title}</label>
                 {field === "Preferences" ? (
                   <div className="w-full flex flex-col">
                       <textarea
                       value={newReservationForm[field] || ""}
                       onChange={(e) => {
                         if (e.target.value.length <= 300) {
                           handleFormFill(field, e.target.value);
                         }
                       }}
                       className="py-2 bg-orange-100 px-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                       rows="2"
                     />
                     <div className="text-right text-sm text-gray-500">
                       {newReservationForm[field]?.length || 0}/300
                     </div>
                   </div>
                 ) : (
                  <input
                  type={type}
                  value={newReservationForm[field] || ""}
                  onChange={(e) => handleFormFill(field, e.target.value)}
                  className="py-2 px-2 bg-orange-100 rounded-lg border w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  {...(type === "number" ? { min, max } : {})}
                />    
                 )}
               </div>
             ))}
           </div>

      <div className="w-[95%] mx-auto min-h-1/3 grid grid-cols-6 bg-white border-orange-400 border-2 rounded-xl p-4 gap-4 items-center">
        <div className="flex gap-2 col-span-2 items-center border-r-2 border-slate-200">
          <div className="text-orange-500 bg-slate-50 rounded-lg text-[36px] p-2">
            <GiForkKnifeSpoon />
          </div>
          <div className="text-[14px]">
            <p className="font-bold">{newReservationForm.ReservationDate}</p>
            <p className="font-medium text-gray-700">
              {newReservationForm.ReservationTime}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap col-span-3 gap-2 ">
          {selectedTables?.map((item, index) => (
            <div key={index} className="relative p-2 px-4 border border-slate-500 rounded-lg">
              {item.TableName}
              <button onClick={() => handleUnSelectTable(item)} type="button" className="absolute top-[-10px] w-[20px] h-[20px] text-xl text-center flex items-center rounded-full justify-center font-bold -right-2 bg-white text-red-500">
                <IoMdCloseCircle />
              </button>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-orange-500 text-center col-span-1 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none">
          Reserve
        </button>
      </div>
    </form>
  );
}
