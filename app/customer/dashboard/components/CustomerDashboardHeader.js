import { FaStar } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";
export default function CustomerDashboardHeader({
    loyaltyPoints = 0,
    walletBalance = 0,
    setCurrentSection,
    currentSection
}){
    const CustomerDashboardHeaderOptions = [
        {title:"My Account",value:"account"},
        {title:"Orders",value:"orders"},
        {title:"Reservations",value:"reservations"},
    ]
    return (
        <div className="w-full lg:h-[150px] h-[100px]  backdrop-blur-md  flex flex-col-reverse lg:flex-row justify-between gap-4 items-center px-4 mt-4">
            <div className="lg:hidden flex gap-4 items-center ">
                {
                    CustomerDashboardHeaderOptions.map((item,index)=>(
                        <button 
                        key={index}
                        onClick={()=>setCurrentSection(item.value)}
                        className={`${currentSection === item.value ? "  border-b-2 border-orange-500":""} font-semibold lg:text-lg text-sm pb-2 px-1`}>
                            <span>{item.title}</span>
                        </button>
                    ))
                }
            </div>
            <div className="lg:flex hidden text-2xl font-bold ">
                My Account
            </div>
            <div className="flex gap-2">
                <div className="border-2 border-orange-200 text-black flex-center  flex-col gap-1 lg:p-2 p-1 px-4 lg:px-8 rounded-xl">
                    <span className="lg:text-lg text-sm font-semibold">Loyalty Points</span>
                    <span className="lg:text-2xl text-md flex gap-2 font-bold items-center"><FaStar className="text-yellow-500"/> {loyaltyPoints}</span>
                </div>
                <div className="border-2 border-orange-200 text-black flex-center  flex-col gap-1 lg:p-2 p-1 px-4 lg:px-8 rounded-xl">
                    <span className="lg:text-lg text-sm font-semibold">Wallet Balance</span>
                    <span className="lg:text-2xl text-md flex gap-2 font-bold items-center"><FaWallet className="text-yellow-500"/> {walletBalance}</span>
                </div>
            </div>
        </div>
    )
}