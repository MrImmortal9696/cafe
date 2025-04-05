import { useState, useEffect } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { HandleReservation } from "@/libs/apifunctions/handleReservation";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";
import { EmailSender } from "@/libs/emailjs/EmailSubmit";

export default function ReservationTableList({
  setTablesData,
  selectedTables,
  setSelectedTables,
  newReservationForm,
  setNewReservationForm,
  setShowTables
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  useEffect(() => {
    setNewReservationForm((prevForm) => ({
      ...prevForm,
      selectedTables: selectedTables,
      TableID_list: selectedTables.map((table) => table.TableID),
    }));
  }, [selectedTables]);

  const handleUnSelectTable = (item) => {
    setSelectedTables((prevTables) =>
      prevTables.filter((table) => table.TableID !== item.TableID)
    );
  };

  async function handleSubmit() {
    console.log("New Reservation Data:", newReservationForm);

    if (!newReservationForm.CustomerEmail || newReservationForm.CustomerEmail.trim() === "") {
      setModalMessage("Customer email is required.");
    } else {
      setIsLoading(true); // Start loading

      const res = await HandleReservation({
        mode: "insert",
        item_type: "Reservations",
        data: newReservationForm,
      });
    
      if (res.result.status === 200) {
        setModalMessage(
          `Your reservation is booked for ${newReservationForm.ReservationDate} at ${newReservationForm.ReservationTime}`
        );
      } else {
        setModalMessage("There was an error while booking the reservation.");
      }

      setIsLoading(false); // End loading
    }
    
    setShowModal(true);

    const updated_res = await HandleUsers({
      mode: "get",
      item_type: "reservedTables",
      data: {
        ReservationDate: newReservationForm.ReservationDate,
        ReservationTime: newReservationForm.ReservationTime,
      },
    });

    //  EmailSender({
    //       formData:{
    //         Name:newReservationForm.CustomerName,
    //         Email:newReservationForm.CustomerEmail,
    //         ReservationDate:newReservationForm.ReservationDate,
    //         ReservationTime:newReservationForm.ReservationTime,
    //         NumberOfGuests:newReservationForm.NumberOfGuests,
    //       },
    //       subject_purpose:"Reservation"
    //       })

    setTablesData(updated_res);

    // Reset form data except date and time
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
    <>
      <div className="w-[95%] mx-auto min-h-1/3 lg:grid grid-cols-6 flex flex-col bg-white border-orange-400 border-2 rounded-xl p-4 gap-4 ">
        <div className="flex gap-2 col-span-2 items-center border-r-2 border-slate-200">
          <div className="text-orange-500 bg-slate-50 rounded-lg lg:text-[36px] text-[18px] p-2">
            <GiForkKnifeSpoon />
          </div>
          <div className="lg:text-[14px] text-[10px]">
            <p className="font-bold">{newReservationForm?.ReservationDate}</p>
            <p className="font-medium text-gray-700">
              {newReservationForm?.ReservationTime}
            </p>
          </div>
        </div>

        {/* Selected Tables Layout */}
        <div className="flex flex-wrap col-span-3 gap-2">
          {selectedTables?.map((item, index) => (
            <div
              key={index}
              className="relative p-2 lg:px-4 px-2 lg:text-[16px] flex-center font-medium text-[12px] border border-slate-500 rounded-lg"
            >
              {item.TableName}
              <button
                onClick={() => handleUnSelectTable(item)}
                type="button"
                className="absolute top-[-10px] w-[20px] h-[20px] text-xl text-center flex items-center 
                           rounded-full justify-center font-bold -right-2 bg-white text-red-500"
              >
                <IoMdCloseCircle />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedTables.length===0} // Disable the button while loading
          className={`${selectedTables.length!==0 ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"} font-medium text-center col-span-1 flex-center  py-2 rounded-lg  focus:outline-none`}
        >
          {isLoading ? (
            <div className="loader"></div> // You can create a loader component here or use a simple spinner
          ) : (
            "Reserve"
          )}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed lg:text-[16px] text-[12px] inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 mx-4 rounded-lg shadow-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold">{modalMessage}</p>
            <button
              onClick={() => {
                setShowTables((prev) => !prev);
                setShowModal(false);
              }}
              className={`  mt-4 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
