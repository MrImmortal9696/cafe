"use client"
import { useState } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaCircle } from "react-icons/fa";
import { convertTo12HourFormat } from "@/libs/hourFormat";
import { GiChiliPepper } from "react-icons/gi";

export default function RecentOrders({order}){
    const [showItems,setShowItems] = useState(false)
    const statusOptions = [
        { title: "Pending", color: "bg-orange-100 text-orange-900 " },
        { title: "Preparing", color: "bg-blue-50 text-blue-900 " },
        { title: "Completed", color: "bg-emerald-100 text-emerald-900 " },
        { title: "Cancelled", color: "bg-red-100 text-red-900 " }
    ];

    const BillData=(data)=>[
        {title:"SubTotal",value:data.BasePriceBill},
        {title:"Taxes",value:data.TaxBill},
        {title:"Wallet",value:`-${data.WalletPayment}`},
        {title:"Total",value:data.NormalPayment}]
    
    const BillOverview=(data)=>[
    {title:"Paid",value:data.NormalPayment},
    {title:"Wallet",value:data.WalletPayment},
]

    return(
        <div className="min-w-[200px] border-2 rounded-lg  border-orange-200 bg-white p-2 lg:p-4 "  >
            <div className="grid grid-cols-6 items-center">
                
                    <div className="text-orange-500 bg-slate-50 rounded-lg flex-center lg:text-[48px] h-[48px] w-[48px] text-[18px] p-2">
                        <GiForkKnifeSpoon />
                    </div>
                
                <div className="flex flex-col w-full col-span-3  gap-1 p-2 ">
                    <div className="font-bold flex gap-2 lg:text-xl text-lg">
                        <span>#{order?.OrderID}</span>
                        <span className="opacity-50">{order?.TableMode}</span>
                    </div>
                    <span className="font-semibold lg:text-lg text-[12px]">{order?.OrderTime && convertTo12HourFormat(order?.OrderTime)}</span>
                    <span className="lg:text-[14px] text-[12px]">{order.OrderDate}</span>
                    <div className="flex justify-between ">
                        <span className="">items: <span className="text-lg font-bold">{order.OrderItems?.length}</span></span>
                        {/* <span>bill: {order.TotalBill}</span> */}
                    </div>
                </div>
                <div className=" col-span-2  h-full flex items-end  gap-2  justify-end  w-full ">
                        <div className="text-[12px] bg-white font-medium lg:text-lg">Bill :</div>
                        <div className="lg:text-2xl  text-[14px] text-nowrap font-bold">£ {order.TotalBill}</div>
                </div>
               
            </div>
            <button 
            className="px-4 py-1 lg:text-[16px] text-[12px] rounded-lg my-2 bg-orange-200 text-orange-800 font-semibold"
            onClick={()=>setShowItems((prev)=>!prev)} >
               {showItems ? "Hide Bill" : "Show Bill"}
            </button>

            <div className="w-full mb-2">
                    <div className={`${statusOptions.find(status => status.title === order.OrderStatus)?.color} 
                                    justify p-2 rounded-lg w-full flex gap-4 items-center lg:text-lg text-[12px] font-semibold`}>
                        <span ><FaCircle/></span>
                        <span>{order.OrderStatus}</span>
                    </div>
            </div>

            {showItems &&
                <div className="w-full rounded-lg min-h-[100px] max-h-[500px] overflow-scroll flex  flex-col no-scrollbar ">
                {
                    order.OrderItems?.map((item,index)=>(
                        <div key={index} className={`w-full bg-opacity-40  px-2 ${statusOptions.find(status => status.title === order.OrderStatus)?.color} `}>
                            <div className="grid grid-cols-7 items-center w-full p-1 lg:p-2">
                                <div className="col-span-4 space-y-2 ">
                                <span className="font-semibold text-[12px] lg:text-[18px] ">{index+1}.  {item.Item.ItemName}</span>
                                 {item.SpiceLevel > 0 && (
                                    <div className="flex gap-2 mt-2 ">
                                    {Array(item.SpiceLevel)
                                        .fill(null)
                                        .map((_, index) => (
                                            <GiChiliPepper
                                            key={index}
                                            className="lg:text-2xl text-[18px] text-red-500"
                                            />
                                        ))}
                                        
                                    </div>
                                    )}
                                        <ul className={`list-disc flex flex-col gap-2 w-[80%]` } >
                                        {item.Options &&
                                         item.Options.map((option, idx) => (
                                            <li key={idx} className={`flex p-2 text-[12px] lg:text-[16px] w-full rounded-md items-center py-1 px-2  justify-between gap-2
                                                ${statusOptions.find(status => status.title === order.OrderStatus)?.color}`}>
                                            {/* {JSON.stringify(option,null,2)} */}
                                            <span>{option.name}</span>
                                            <span className="font-semibold text-nowrap ">£ {option.price}</span>

                                            </li>
                                        ))}
                                        </ul>
                                </div>
                                <div className="font-semibold lg:text-lg text-[12px] ">x {item.Quantity}</div>
                                <div className="font-semibold lg:text-lg text-[12px] text-end  text-nowrap col-span-2">£ {item.Price}</div>
                            </div>
                        </div>
                    ))
                }

            <div className=" flex gap-1 items-end flex-col w-full p-2">
                {BillData(order).map((item,index)=>(
                    <div key={index} className="grid grid-cols-2 bg-white w-[50%]">

                    <div className="text-[12px] bg-white text-end lg:text-[16px]">{item.title}</div>
                    <div className="lg:text-[18px] text-end text-[14px] text-nowrap font-bold">£ {item.value}</div>
                </div>
                ))}
            </div>
            </div>
            }
      
            <pre>
                {/* {JSON.stringify(order,null,2)} */}
            </pre>
        </div>
    )
}