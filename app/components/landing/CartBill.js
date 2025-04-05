import { useEffect, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { useSession } from "next-auth/react";
import { MakeOrder } from "@/libs/apifunctions/handleOrders";
import { TfiWrite } from "react-icons/tfi";
import { ImSpinner2 } from "react-icons/im"; // Import spinner icon
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { TbNote } from "react-icons/tb";
import Reservation from "@/app/reservation/page";
import { FaLongArrowAltRight } from "react-icons/fa";
import RecentReservations from "@/app/customer/dashboard/components/RecentReservations";
import { getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";
import Link from "next/link";
import { EmailSender } from "@/libs/emailjs/EmailSubmit";
export default function CartBill({user,walletBill,
                                useWallet,finalBill,
                                NewWalletBalance,selectedReservation,
                                reservationsList,setSelectedReservation,
                                setReservationsList,setShowCartBill,
                                TaxBreakdown}) {
    const [orderMode, setOrderMode] = useState("Dining");
    const [pickupTime, setPickupTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state
    const { cart, getTotalCost, getTotalTaxSum, getTotalBillWithTaxes, clearCart } = useCart();
    const { data: session } = useSession();
    const [orderNote, setOrderNote] = useState("");
    const [showOrderNote, setShowOrderNote] = useState(true);
    const [showReservations,setShowReservations] = useState(false)

    useEffect(()=>{

    function chooseReservation(item){
        if(showReservations){
            setSelectedReservation(item)
        }
    }

    chooseReservation()
    },[setSelectedReservation,showReservations])

    const bill_data = {
        BasePriceBill: getTotalCost(),
        TaxBill: getTotalTaxSum(),
        TotalBill: getTotalBillWithTaxes(),
        finalBill:finalBill,
        walletBill:walletBill,
        CustomerEmail: session?.user.email,
    };
    async function handlePlaceOrder() {
        if (!session) {
            setModalMessage("Please register or log in to place an order.");
            setShowLoginModal(true);
            return;
        }
        if (orderMode === "Takeaway" && !pickupTime.trim()) {
            setModalMessage("Please select a pickup time.");
            setIsModalOpen(true);
            return;
        }

        setLoading(true); // Start loading

      

        const curr_Date = new Date();

        const formattedDate = getLocalDate_YMD() // yyyy-mm-dd
        const formattedTime = getLocalTime(); // hh:mm

        try {
            await MakeOrder({
                mode: "insert",
                item_type: "cart_Orders",
                data: { ...bill_data, 
                    TableMode: orderMode, 
                    PickupTime: pickupTime, 
                    OrderNote: orderNote, 
                    OrderDate: formattedDate, 
                    OrderTime: formattedTime, 
                    OrderPlacedBy: "Customer",
                    PaymentMode: useWallet ? "Wallet" : "Normal",
                    ReservationID:selectedReservation?.ReservationID || null
                 },
            });

            await MakeOrder({
                mode: "insert",
                item_type: "order_items",
                data: { cart, CustomerEmail: session?.user.email },
            });

            if(useWallet){
                await MakeOrder({
                mode: "update",
                item_type: "Wallet_Order_billing",
                data: { ...bill_data,WalletBalance:walletBill , CustomerEmail: session?.user.email },
                })

                await HandleUsers({
                    mode:"update",
                    item_type:"wallet_balance",
                    data:{...bill_data,WalletBalance:NewWalletBalance,CustomerEmail: session?.user.email}
                })

            }
            else{
                await MakeOrder({
                    mode: "update",
                    item_type: "Order_billing",
                    data: { ...bill_data, CustomerEmail: session?.user.email },
                })
            }

            EmailSender({
                formData:{
                    Name:session.user.name,
                    Email:session.user.email,
                    bill_data:bill_data,
                    taxBreakdown:TaxBreakdown,
                    cart:cart
                    },
                subject_purpose:"Order"
                })

            setModalMessage("Your Order is placed!");
            setIsModalOpen(true);
            clearCart();
        } catch (error) {
            console.error("Error placing order:", error);
            setModalMessage("There was an issue placing your order. Please try again.");
            setIsModalOpen(true);
        }

        setLoading(false); // Stop loading
    }


    return (
        <div className="lg:w-[50%] flex-col flex-center w-full mx-auto lg:p-6 mt-4 bg-zinc-100 py-2 font-sans rounded-lg">
            <h2 className="text-lg lg:text-2xl font-semibold mb-4 text-center">Choose Order Type</h2>

            <div className="flex justify-center text-zinc-600 font-semibold gap-4 text-[12px] lg:text-[16px] mb-4">
                <button className={`px-4 py-2 rounded-md ${orderMode === "Dining" ? "bg-orange-200" : "bg-gray-300"}`} 
                        onClick={() => setOrderMode("Dining")}>
                             Dining
                </button>
                <button className={`px-4 py-2 rounded-md 
                        ${orderMode === "Takeaway" ? "bg-orange-200" : "bg-gray-300"}`} 
                        onClick={() => {
                            setOrderMode("Takeaway")
                            setSelectedReservation(null)
                            }}>
                              Takeaway
                </button>

                <button className={`px-4 py-2 rounded-md text-[24px]  ${showOrderNote ? "bg-orange-200 text-zinc-700" : "bg-zinc-700 text-white"}`} 
                        onClick={() => setShowOrderNote((prev) => !prev)}>
                    <TbNote />
                </button>
            </div>

            <div className=" w-full flex-center flex-col">
            {orderMode === "Takeaway" && (
                <div className="mb-4 lg:w-[50%] w-[80%]">
                    <label className="block text-gray-700 text-lg font-medium mb-2">Select Pickup Time</label>
                    <input type="time" className="border border-gray-400 rounded-md p-2 w-full" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                </div>
            )}

        {
            orderMode==="Dining" &&
                <button 
                    onClick={() => {
                        setShowReservations((prev) => !prev);
                        setSelectedReservation(null); // Reset selected reservation
                        }}
                    className="p-2 bg-orange-400 hover:bg-orange-500 transition-all duration-100 ease-in rounded-lg text-white"
                >
                    <div className="font-semibold text-lg ">
                        { reservationsList.length > 0 ? 
                            "Select your Reservation" : 
                            <Link href="/tables" className="flex items-center gap-2">
                                <span>
                                    Please make a Reservation to Proceed
                                </span>
                                <span>
                                    <FaLongArrowAltRight/>
                                </span>
                                </Link> }
                    </div>  
                </button>}

            {/* <pre>{JSON.stringify(selectedReservation,null,2)}</pre> */}

            {selectedReservation  && 
                <div className={`my-2 w-full flex-center flex-col `}>
                                <RecentReservations reservation={selectedReservation} />
                        <p className="font-semibold mt-2">Your Reservation is selected</p>  
                </div>
        }


            <div
            className={`my-6 font-sans space-y-2 overflow-y-scroll no-scrollbar transition-all duration-200 ease-in-out 
                    ${showReservations && orderMode==="Dining" ? "max-h-[500px]" : "max-h-0"}`}>
                
                    
                    {/* <pre>{JSON.stringify(selectedReservation,null,2)}</pre> */}

                { !selectedReservation && reservationsList?.map((item, index) => (
                <div  
                    key={index}
                    onClick={() => {
                        // console.log(item)
                    if(!selectedReservation>0)
                        {
                        setSelectedReservation(item); // Update selected reservation
                        setShowReservations(false)
                         }
                    }}
                >
                    <RecentReservations reservation={item} />
                </div>
                ))}
            </div>


            {showOrderNote && (
                <div className="w-full px-2">
                    <textarea maxLength="200" onChange={(e) => setOrderNote(e.target.value)} value={orderNote} placeholder="Add a note (max 200 characters)" rows="4"  
                    className="rounded-lg border-2 border-orange-200 p-4 focus:outline-none w-full" />
                    <p className="w-full text-end text-[12px] text-zinc-400">{orderNote.length}/200</p>
                </div>
            )}
            </div>
{/* 
            <span>time : {pickupTime}</span> */}

            {/* Order Button with Loader */}
            <button 
                className={`
                    text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2
                    ${loading || (orderMode === "Dining" && !selectedReservation) || (orderMode === "Takeaway" && !pickupTime.trim()) 
                        ? "bg-gray-400 cursor-not-allowed" // Disabled state
                        : "bg-orange-400 hover:bg-orange-500" // Enabled state
                    }
                `} 
                onClick={handlePlaceOrder} 
                // onClick={()=>console.log(TaxBreakdown,cart,bill_data)}
                // disabled={
                //     loading ||
                //     (orderMode === "Dining" && !selectedReservation) ||
                //     (orderMode === "Takeaway" && !pickupTime.trim())
                // }
            >
                {loading ? (
                    <>
                        <ImSpinner2 className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Place Order"
                )}
            </button>


            {/* Order Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] md:w-[50%] lg:w-[30%] relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute top-3 right-3 text-gray-600 text-xl font-bold" 
                            onClick={() => setIsModalOpen(false)}>
                                ×
                            </button>
                        <h3 className="text-xl font-semibold mb-2 text-center">Order at Tropical Cafe</h3>
                        <p className="text-gray-700 text-center">{modalMessage}</p>
                        <div className="mt-4 flex justify-center">
                            <button 
                            className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold"
                            onClick={() => {
                                setIsModalOpen(false)
                                setShowCartBill(false)}}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
