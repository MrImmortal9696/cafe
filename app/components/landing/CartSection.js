"use client"
import { useState,useEffect } from "react";
import { useCart } from "@/app/contexts/CartContext";
import CartItems from "../elements/cartitems";
import CartElement from "../elements/CartElements";
import CartBill from "./CartBill";
import LoginForm from "./LoginForm";
import { MakeOrder } from "@/libs/apifunctions/handleOrders";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getLocalDate_YMD } from "@/libs/hourFormat";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import RecentReservations from "@/app/customer/dashboard/components/RecentReservations";

export default function CartSection() {
  const {  
    cart, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    getTotalCost, 
    getUniqueItemsCount, 
    getTotalTaxSum, 
    getTotalBillWithTaxes, 
    getTaxBreakdown,
    
    walletBalance,
    clearCart,
    TaxesList
  } = useCart();
    
  const [showCartBill, setShowCartBill] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [useWallet,setUseWallet] = useState(false)
  const [walletBill,setWalletBill] = useState()
  const [finalBill,setFinalBill] = useState()
  const { data: session } = useSession();
  const router = useRouter();
  const [NewWalletBalance,setNewWalletBalance] = useState(walletBalance)
  const [reservationsList,setReservationsList] = useState([])
  const subtotal = parseFloat(getTotalCost()) || 0;
  const taxAmount = parseFloat(getTotalTaxSum()) || 0;
  const totalWithTax = parseFloat(getTotalBillWithTaxes()) || 0;
  const TaxBreakdown = getTaxBreakdown()
  const [selectedReservation,setSelectedReservation] = useState(null)

  useEffect(() => {
    const balance = walletBalance || 0;
    const total = totalWithTax || 0;
  
    if (useWallet) {
      if (balance >= total) {
        setWalletBill(total); 
        setFinalBill(0); 
      } else {
        setWalletBill(balance); 
        setFinalBill(total - balance); 
      }
    } else {
      setWalletBill(0);
      setFinalBill(total);
    }
  }, [useWallet, walletBalance, totalWithTax]);
  
  // Separate useEffect to update NewWalletBalance
  useEffect(() => {
    setNewWalletBalance((walletBalance - walletBill).toFixed(2));
  }, [walletBill, walletBalance]);
  
  useEffect(() => {
    let fetched = false;
  
    async function GetReservationsList() {
      if (fetched) return; // Prevent multiple calls
  
      const reservations_res = await HandleUsers({
        mode: "get",
        item_type: "current_date_reservations",
        data: { CurrentDate: getLocalDate_YMD(), CustomerEmail: session.user.email }
      });
  
      setReservationsList(reservations_res);
      fetched = true;
    }
  
    if (session?.user && reservationsList.length === 0) {
      GetReservationsList();
    }
  }, [session]);
  
  

  // Sorting cart items based on the length of selections
  const sortedCart = [...cart].sort((a, b) => a.selections.length - b.selections.length);


  async function HandleSaveToCart() {
    if (!session) {
      setModalMessage("Please register or log in to place an order.");
      setShowLoginModal(true);
      return;
    }

    const bill_data = {
      BasePriceBill: getTotalCost(),
      TaxBill: getTotalTaxSum(),
      TotalBill: getTotalBillWithTaxes(),
      CustomerEmail: session.user.email
    };

    await MakeOrder({ mode: "insert", item_type: "cart_item", data: { cart: cart, CustomerEmail: session.user.email } })
      .then(
        await MakeOrder({ mode: "update", item_type: "cart_bill", data: bill_data })
      )
     
    setModalMessage("Your Cart has been saved");
    setIsModalOpen(true);
  };

  return (
    <div className="w-full font-serif overflow-hidden rounded-xl">
      <div className="w-full h-[15%] flex-center flex-col gap-2 rounded-t-lg shadow-xl bg-white">
        <span className="w-[40px] h-[8px] rounded-lg bg-orange-400"></span>
        <span className="text-[16px] lg:text-[24px] font-bold">Here's your cart!</span>
      </div>

      <div className="w-full pb-4 grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-3 bg-white overflow-y-scroll no-scrollbar">
        {sortedCart.length > 0 ? (
          sortedCart.map((item) => (
            <CartElement
              item={item}
              key={item.id}
              decrementQuantity={decrementQuantity}
              incrementQuantity={incrementQuantity}
              removeFromCart={removeFromCart}
            />
          ))
        ) : (
          <div className="text-center w-full col-span-3 text-gray-500 py-8">Your cart is empty</div>
        )}
      </div>

      <div className="lg:w-[60%] w-[100%] mt-4 rounded-xl lg:px-6 px-2 py-4 mx-auto bg-gradient-to-b from-zinc-100 to-zinc-100">
        <div className="mt-4 text-[14px] lg:text-[14px] xl:text-[18px] font-medium">
          <div className="flex justify-between  pt-2">
            <span>Subtotal ({getUniqueItemsCount()} items):</span>
            <span>£ {subtotal.toFixed(2)}</span>
          </div>

          {TaxBreakdown.map((taxItem,index)=>(
              <div
               key={index}
               className="flex justify-between mt-2">
              <span>{taxItem.TaxName} ({taxItem.TaxPercentage}%):</span>
              <span>£ {taxItem.Amount}</span>
            </div>
          ))}
          
          <div className="">
            {
              walletBalance>0 && session.user &&
                <div className="w-fill flex justify-between text-[12px] lg:text-[16px] items-center py-2 ">
                  <div>
                      <div className="text-md">
                          <span>Current Wallet Balance : </span>
                          <span className="font-semibold">£ {walletBalance}</span>
                      </div>

                    { useWallet && NewWalletBalance>0 &&
                      <div className="text-md ">

                          <span>Remaining Wallet Balance : </span>
                          <span className="font-semibold">£ {NewWalletBalance} </span>

                      </div>
                      }
                    </div>
                    
                  <div className="">
                      <button 
                          disabled={walletBalance === 0}
                          onClick={() => setUseWallet((prev) => !prev)}
                          className={`lg:p-2 p-1 text-[10px] lg:text-[14px]  rounded-lg lg:px-4 font-sans font-semibold text-white
                              ${walletBalance === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-orange-400"}
                          `}
                      >
                          {useWallet ? "Cancel" : "Use Wallet"}
                      </button>
                  </div>
                </div>
            }
          </div>

          <div className="flex justify-between mt-2 font-bold lg:text-2xl text-lg">
              <span>Total:</span>
              <div className="grid text-center">
                  <span>{finalBill && ` £ ${finalBill?.toFixed(2)}` }</span>
                  <span className="text-[12px] font-normal font-sans">
                      {useWallet && ` (Paid £ ${walletBill.toFixed(2)} from wallet)`}
                  </span>

              </div>
             
          </div>

        
        <div className="flex justify-end mt-4 text-white rounded-lg text-[12px] lg:text-[14px] xl:text-[20px] font-semibold font-sans">
      
          <button 
            className={`xl:px-6 p-2 py-3 rounded-lg cursor-pointer ${
              totalWithTax > 0 && (session && session.user.role==="customer" ) ? "bg-orange-400" : "bg-gray-400 cursor-not-allowed"
            }`}
            // onClick={() =>
            //   {
            //     if(session && session.user ){
            //     totalWithTax > 0 && setShowCartBill((prev) => !prev)
            //     }
            //     else{
            //     setShowLoginModal(true)

            //   }
            //   }}
            onClick={()=>console.log(cart,getTaxBreakdown())}
            disabled={totalWithTax === 0 || (session && session.user.role!=="customer" ) }
          >
            Proceed to Checkout
          </button>
         
        </div>
      </div>

     
      {showCartBill && 
        <CartBill 
          selectedReservation={selectedReservation}
          user={session?.user || null} 
          finalBill={finalBill}
          walletBill={walletBill}
          NewWalletBalance={NewWalletBalance}
          useWallet={useWallet}
          reservationsList={reservationsList}
          setSelectedReservation={setSelectedReservation}
          setReservationsList={setReservationsList}
          setShowCartBill={setShowCartBill}
          TaxBreakdown={getTaxBreakdown()}
          />
        }

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} // Clicking outside closes modal
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg w-[80%] md:w-[50%] lg:w-[30%] relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
            <button 
              className="absolute top-3 right-3 text-gray-600 text-xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2 text-center">Order Confirmation</h3>
            <p className="text-gray-700 text-center">{modalMessage}</p>
            <div className="mt-4 flex justify-center">
              <button 
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowLoginModal(false)} // Clicking outside closes modal
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg w-[80%] md:w-[50%] lg:w-[30%] relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
            <button 
              className="absolute top-3 right-3 text-gray-600 text-xl font-bold"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <div className="w-full flex-center flex-col">
              <h3 className="text-xl font-semibold mb-2 text-center">Login Required</h3>
              <p className="text-gray-700 text-center">{modalMessage}</p>
              <LoginForm path={"/cart"} showReg={false} setShowLogin={setShowLoginModal} />
            </div>
            <div className="mt-4 flex justify-center">
              <button 
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold"
                onClick={() => setShowLoginModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>

  );
}
