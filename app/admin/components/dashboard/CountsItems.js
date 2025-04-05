import { BsCupFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { IoPeopleSharp } from "react-icons/io5";
import { MdTableBar } from "react-icons/md";
import { PiNotebookFill } from "react-icons/pi";
import { ImSpoonKnife } from "react-icons/im";

export default function CountItems({name,count,icon}){
    const summary_icons = [<BsCupFill/>,<ImSpoonKnife/>,<IoPeopleSharp/>,<PiNotebookFill/>,<MdTableBar/>]
    return (
        <div className="border  rounded-xl bg-white flex-center flex-col gap-2 p-4">
            <div className="flex gap-4 items-center">
                <div className="p-4 bg-zinc-100 text-[36px] text-orange-400 rounded-full">
                    {summary_icons[icon]}
                </div>
                <div className="text-4xl font-semibold">
                    {count}
                </div>
            </div>
            <div className="font-medium text-lg">
                {name}
            </div>
           
        </div>
    )
}