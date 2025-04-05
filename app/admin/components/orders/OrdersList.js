"use client";
import { FaFileDownload } from "react-icons/fa";
import { convertJsonToCsv } from "@/libs/jsonTocsv";
import OrderListElement from "./OrderListElement";
import { useState, useEffect } from "react";

export default function OrdersList({ ordersArray, searchItem }) {
    const orderHeaders = [
        { title: "Order Id", span: 1 },
        { title: "Date", span: 1 },
        { title: "Customer", span: 2 },
        { title: "Bill", span: 1 },
        { title: "Status", span: 1 },
        { title: "TableMode", span: 1 },
        { title: "Table", span: 1 },
        { title: "Actions", span: 1 },
    ];

    const [updatedList, setUpdatedList] = useState([]);

    useEffect(() => {
        // Apply search filter when ordersArray or searchItem changes
        const filteredList = ordersArray?.filter(order =>
            searchItem 
                ? order.CustomerName.toLowerCase().includes(searchItem.toLowerCase()) ||
                  order.CustomerEmail.toLowerCase().includes(searchItem.toLowerCase()) 
                : true
        );
        setUpdatedList(filteredList);
    }, [ordersArray, searchItem]);
    

    function RemoveOrderFromList(id) {
        setUpdatedList((prevList) => prevList.filter((order) => order.OrderID !== id));
    }

    const handleExport = () => {
        if (updatedList.length === 0) {
            alert("No data to export.");
            return;
        }
        convertJsonToCsv(updatedList, "orders.csv");
    };

    return (
        <div className="p-4 relative bg-white w-[95%] mx-auto h-[calc(100vh-300px)] overflow-y-scroll no-scrollbar rounded-lg">
            <div className="text-[20px] my-2 w-full flex justify-end">
                <button onClick={handleExport} className="flex items-center flex-col">
                    <span className="text-[12px]">Export</span>
                    <FaFileDownload />
                </button>
            </div>

            <div className="grid grid-cols-9 text-center gap-4 bg-zinc-100 rounded-t-lg font-bold text-lg mb-4">
                {orderHeaders.map((header, index) => (
                    <div key={index} className={`text-gray-800 py-2 col-span-${header.span}`}>
                        {header.title}
                    </div>
                ))}
            </div>

            <div className="flex flex-col border-2 border-zinc-200 rounded-lg">
                {updatedList?.length > 0 ? (
                    updatedList
                        ?.sort((a, b) => b.OrderID - a.OrderID) // Sort by OrderID, descending (latest first)
                        .map((order, index) => (
                            <div key={order.OrderID || index} className="">
                                <OrderListElement item={order} RemoveOrderFromList={RemoveOrderFromList} />
                            </div>
                        ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No orders available</div>
                )}
            </div>
        </div>
    );
}
