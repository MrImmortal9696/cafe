import { convertTo12HourFormat } from "@/libs/hourFormat";
import { MdTableBar } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

export default function RecentReservations({reservation}){

  const statusOptions = [
    { title: "ongoing", color: "bg-yellow-50 text-yellow-700 ",TableColor: "text-yellow-700 ", bgColor: "bg-yellow-50 "},
    { title: "Completed", color: "bg-green-50 text-green-700 ",TableColor: " text-green-700 " ,bgColor: "bg-green-50 "},
    { title: "Cancelled", color: "bg-red-50 text-red-700 ",TableColor: " text-red-700 " ,bgColor: "bg-red-50 "},
    
];

    return (
        <div className={`w-full mx-auto min-h-1/3 space-y-2 lg:space-y-4 bg-white border-orange-300 border-2 flex flex-col justify-between rounded-xl p-2 lg:p-4 gap-4  `}>
          <div className="w-full flex  lg:flex-row flex-col gap-2 items-center justify-between ">
                  <div className="flex flex-shrink-0 gap-2  items-center ">
                    <div className={`
                                  bg-slate-50 rounded-lg lg:text-[36px] text-[18px] p-2`}>
                      <MdTableBar />
                    </div>
                    <div className="lg:text-[14px] text-[10px]">
                      <p className="font-bold">{reservation?.ReservationDate}</p>
                      <p className="font-medium text-gray-700">
                        {/* {reservation?.ReservationTime && 
                          convertTo12HourFormat(reservation?.ReservationTime)
                        } */}
                        {reservation.ReservationTime}
                      </p>
                    </div>
                  </div>
          
                  <div className="flex flex-wrap flex-shrink-1 items-center justify-end gap-2">
                    {reservation.Tables?.map((item, index) => (
                      <div
                        key={index}
                        className="relative p-2 bg-white lg:px-4 px-2  flex-center font-medium text-[12px] border border-slate-500 rounded-lg"
                      >
                        <span className="lg:text-[14px] text-[10px]">{item.TableName}</span>

                        <div className="absolute p-2 bg-orange-300 text-orange-600 flex-center -top-2 -right-2 
                                  w-[10px] h-[10px] text-[8px] lg:w-[20px] lg:h-[20px] lg:text-[12px] rounded-full font-bold">
                            {item.Floor_Value}
                        </div>
                        
                      </div>
                    ))}
                  </div>
              </div>

                 <div className="w-full opacity-80  ">
                      <div className={`${statusOptions.find(status => status.title === reservation.Reservation_Status)?.color} 
                                      justify p-2 rounded-lg w-full flex gap-4 items-center lg:text-lg text-[12px] font-semibold`}>
                          <span ><FaCircle/></span>
                          <span>{reservation.Reservation_Status}</span>
                      </div>
                  </div>

        </div>
    )
}