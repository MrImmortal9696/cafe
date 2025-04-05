"use client"
import CartElement from "@/app/components/elements/CartElements";
import MenuItems from "@/app/components/elements/menuItems";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { GiChiliPepper } from "react-icons/gi";
import { MakeOrder } from "@/libs/apifunctions/handleOrders";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { convertTo12HourFormat } from "@/libs/hourFormat";
import ReservationTablesListElement from "../reservations/components/ReservationsTablesListElement";
export default function OrderListElement({item,RemoveOrderFromList}){
    const [showOrderItems, setShowOrderItems] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(item.OrderStatus);
    const [pickupTime, setPickupTime] = useState(item.PickupTime || "");
    const [tableMode, setTableMode] = useState(item.TableMode || "");
    const [editMode,setEditMode] = useState(false)
    function formatDate(dateString) {
        const date = new Date(dateString);
        
        // Formatting the date
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        
        // Formatting the time
        const timeOptions = { 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        
        return { formattedDate, formattedTime };
    }
    const statusOptions = [
        { title: "Pending", color: "bg-yellow-50 text-yellow-900 " },
        { title: "Preparing", color: "bg-blue-50 text-blue-900 " },
        { title: "Completed", color: "bg-green-50 text-green-900 " },
        { title: "Cancelled", color: "bg-red-50 text-red-900 " }
    ];
    

    const TableModeOptions = ["Dining","Takeaway"]

    async function OrderStatusUpdate() {
        setEditMode(false)
        const updatedData = {
            OrderID: item.OrderID,
            OrderStatus: selectedStatus,
            PickupTime: tableMode === "Dining" ? null : pickupTime,
            TableMode: tableMode,
        }
        await MakeOrder({mode:"update",item_type:"orders",data:updatedData})
    }

    async function DeleteOrder() {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        
        if (confirmDelete) {
            RemoveOrderFromList(item.OrderID);
            await MakeOrder({ mode: "delete", item_type: "orders", data: { OrderID: item.OrderID } });
        }
    }
    

    function OrderItemElement({order_item}){
        return (
            <div
            onClick={()=>console.log(item)} 
            key={order_item.OrderItemID} className="py-2 px-2 w-full h-full grid grid-cols-6 text-lg ">
                {/* <pre>{JSON.stringify(order_item.MenuItem,null,2)}</pre> */}
                <span className="flex gap-4 items-center flex-col w-full justify-between col-span-3">
                    <span className="font-semibold  ">{order_item.MenuItem.ItemName}</span>
                    <div className="mt-2 text-gray-600 ">
                        {order_item.Options && order_item.Options.length > 0 ? (
                            <ul className="text-sm flex w-full  flex-col gap-2">
                            {order_item.Options.map((option, index) => (
                                <li
                                key={index}
                                className="flex items-center bg-gray-200 w-full  rounded-md px-2 py-1 border border-gray-200 shadow-sm"
                                >
                                <span className="font-bold text-orange-500 mr-2">•</span>
                                <div className="flex w-full gap-4 justify-between items-center">
                                    <span>{option.name}</span>
                                    <span className="font-semibold flex items-center justify-center gap-2">
                                    £ {option.price}
                                    </span>
                                </div>
                                </li>
                                    ))}
                                    </ul>
                            ) : (
                                ""
                            )}
                        </div>
                    </span>

                {order_item.SpiceLevel > 0 && (
                <div className="flex gap-2 mt-2 w-full">
                {Array(5)
                    .fill(null)
                    .map((_, index) => (
                    <GiChiliPepper
                        key={index}
                        className={`text-2xl ${
                        index < order_item.SpiceLevel ? "text-red-500" : "opacity-50 text-red-300"
                        }`}
                    />
                    ))}
                </div>
                )}
                <span className="font-bold text-center">x{order_item.Quantity}</span>
                <span className=" font-semibold">£{order_item.Price || '-'}</span>

            
            </div>
        )
    }
    
    return (
        <div className={`rounded-t-lg flex flex-col gap-2  border-b-2 pb-2 ${statusOptions.find(status => status.title === selectedStatus)?.color}`}>
            <div className="grid grid-cols-9 text-center py-2 " >
                <span className="flex-center gap-2 text-xl font-bold" onClick={()=>setShowOrderItems((prev)=>!prev)}>
                    <span>{item.OrderID}</span>
                    <span className={`${showOrderItems? "rotate-0":"-rotate-90"}`}><MdExpandMore/></span>
                </span>
                <span className="flex-center flex-col ">
                    <span className="font-semibold text-lg">{item.OrderTime}</span>
                    <span className="font-medium text-sm">{item.OrderDate}</span>

                </span>
                <div className="col-span-2  flex-center flex-col h-full">
                    <span className="font-semibold text-lg">{item.CustomerName}</span>
                    <span className="font-medium text-sm">{item.CustomerEmail}</span>
                    {item.OrderNote &&  
                       <p className="mt-4 break-words w-full h-full  font-medium">
                       "{item.OrderNote}"
                   </p>
                   
                    }
                </div>
                <div className="flex-center flex-col">
                    <span className={` font-semibold text-lg flex-center flex-col`}>£ {item.NormalPayment}</span>

                    {item.PaymentMode === "Wallet" && 
                        <span className="font-semibold text-lg flex-center flex-col">
                            {item.PaymentMode} - £ {item.WalletPayment}
                        </span>
                    }
                </div>
                <span className="flex-center flex-col">
                    {editMode && <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="" disabled>Select Status</option>
                        {statusOptions.map((status, index) => (
                            <option key={index} value={status.title}>
                                {status.title}
                            </option>
                        ))}
                    </select>}
                    {!editMode && selectedStatus}
                </span>

                <span className="flex-center gap-2 flex-col">
                { editMode &&  tableMode!=="Dining" &&
                <input 
                    type="time" 
                    value={pickupTime || ""} 
                    onChange={(e) => setPickupTime(e.target.value)} 
                    className="p-2 border rounded-md"
                />}
                    {!editMode && pickupTime && tableMode!=="Dining" &&
                        <span className="font-bold">
                            {convertTo12HourFormat(pickupTime)}
                        </span>
                    }
                    <span className="flex-center flex-col">
                        {editMode &&
                            <select
                                onChange={(e) => setTableMode(e.target.value)}
                                className="p-2 border rounded-md"
                                value={tableMode}>
                                {/* <option value="" disabled> Select a TableMode</option> */}
                                {TableModeOptions.map((option,index)=>(
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        }
                        <span className="font-medium">{!editMode && tableMode}</span>

                    </span>
                </span>
                <div 
                    className="flex-center flex-col col-span-1">
                        {/* <pre>{JSON.stringify(item.Reservation.Tables,null,2)}</pre> */}
                        <ReservationTablesListElement Tables={item.Reservation.Tables} />
                </div>
                <span className="flex-center gap-4 ">
                    <button onClick={()=>{
                        editMode ? OrderStatusUpdate() : setEditMode(true)}}
                        className={`${editMode ? "bg-green-400 ":"bg-zinc-800  bg-opacity-50"}  text-white  text-2xl rounded-full p-2`}>
                        {!editMode ?
                        <MdEdit/> :
                        <MdDone/>}
                    </button>
                    <button 
                        onClick={()=>DeleteOrder()}
                        className={`text-white bg-red-400 text-2xl rounded-full p-2`}>
                        <MdDelete/>
                    </button>
                </span>
                

            </div>
            {showOrderItems &&
                <div className="w-[80%] mx-auto  py-4 flex flex-col gap-2 border-2 bg-zinc-50 rounded-lg">
              {item.OrderItems.map((item,index)=>( 
                <div key={index} className="border-b-2">
                    <OrderItemElement order_item={item}  />
                </div>
                ))}
            </div>}
        </div>
    )
}