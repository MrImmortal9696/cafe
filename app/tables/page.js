"use client";
import { useState,useEffect } from "react";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import WineGlass from "../components/elements/wineglass";
import SocialsIcons from "../components/elements/socialsIcons";
import Footer from "../components/landing/Footer";
import TablesDraggableBox from "../admin/components/Tables/TablesDraggableBox";
import MakeReservation from "../admin/components/reservations/MakeReservation";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { PanTableLayout } from "../admin/components/Tables/PanTableLayout";
import CustomerMakeReservation from "../admin/components/reservations/CustomerMakeReservation";
import { FaCircle } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import ReservationTableList from "../admin/components/Tables/ReservationTablesList";
import { getLocalDate, getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";
export default function MenuPage() {
  // State to manage the visibility of the last paragraph
  const [showMore, setShowMore] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [tablesdata, setTablesData] = useState([]);
  const [showTable,setShowTables] = useState(false)
  const [newReservationForm, setNewReservationForm] = useState({
    ReservationDate: getLocalDate_YMD(),
    ReservationTime: getLocalTime(),
    selectedTables: selectedTables,
    TableID_list: selectedTables.map((table) => table.TableID),
    Reservation_type: "reserved",
  });


    useEffect(() => {
      async function GetReservedTables() {
      console.log(newReservationForm.ReservationDate,newReservationForm.ReservationTime)
        const res = await HandleUsers({
          mode: "get",
          item_type: "reservedTables",
          data: {
            ReservationDate: newReservationForm.ReservationDate,
            ReservationTime: newReservationForm.ReservationTime,
          },
        });
        
        setTablesData(res)
        console.log({ res });
      }
      GetReservedTables();
    }, [newReservationForm.ReservationDate, newReservationForm.ReservationTime]);
  


  return (
    <div className="relative overflow-x-hidden bg-black  ">
      {/* Fixed Header */}
      <div className="fixed z-10 w-full top-0">
        <Header currentSection="Tables" />
      </div>

      {/* Main Content */}

      <div className="flex flex-shrink-0  h-full flex-col items-center ">
        {" "}
        {/* Added padding for fixed header */}
        {/* Hero Section */}
        <HeroSection
          imagelink="https://i.pinimg.com/736x/f4/37/8b/f4378b53ce36da19e06d0f59941a3c63.jpg"
          blur={0}
          height={50}
          top="Our Menu"
          heading="Serving our best"
          description="Explore our authentic Caribbean flavors, crafted with bold spices and vibrant traditions."
          nav={[
            { name: "HOME", link: "/" },
            { name: "Tables", link: "/tables" },
          ]}
        />
        {/* About Section */}
        <div className="w-[95%] h-auto relative rounded-[20px] container-shadow-top pb-[10vh] bg-white">
          {/* WineGlass */}
          <div className="absolute w-full flex-center top-[-40px]">
            <WineGlass />
          </div>
          <div className="w-full mx-auto px-6 flex-col-center  gap-8 mt-12">
            {/* Title */}

            <div className="bg-[#F59D12] bg-opacity-30 px-4 py-2 rounded-xl">
              <SocialsIcons />
            </div>

            {showTable &&
              <div className="lg:shadow-[0px_0px_40px_rgba(0,0,0,0.2)] rounded-xl w-[95vw] lg:w-[70%] h-[50vh] lg:min-h-[900px] gap-2  flex-center flex-col lg:h-[70vh] flex-center ">
              
              <TablesDraggableBox
               tables={tablesdata}
              //  setTablesData={setTablesData}
               setSelectedTables={setSelectedTables}
               selectedTables={selectedTables}    
              />
            
            </div>}
           {showTable &&
            <div className=" w-[95vw]  lg:w-[70%] gap-2 flex-col-reverse lg:flex-row flex-center ">
              <button
                  onClick={()=>(setShowTables((prev)=>!prev))}
                  className="bg-orange-500 lg:w-[10%] w-[50%] text-center col-span-1
                   text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none"
                >
                  Back
            </button>
              <ReservationTableList
                      selectedTables={selectedTables}
                      setSelectedTables={setSelectedTables}
                      newReservationForm={newReservationForm}
                      setNewReservationForm={setNewReservationForm}
                      setTablesData={setTablesData}
                      tablesdata = {tablesdata}
                      setShowTables = {setShowTables}
               />
            
            </div>}
            {/* <div>
                <PanTableLayout>{<div>Hello</div>}</PanTableLayout>
            </div> */}
            { !showTable &&
                 <div className=" rounded-xl
                      w-[95vw] lg:w-[70%] min-h-[60vh] lg:min-h-[870px] lg:h-[70vh] ">
                    <CustomerMakeReservation
                        selectedTables={selectedTables}
                        setSelectedTables={setSelectedTables}
                        newReservationForm={newReservationForm}
                        setNewReservationForm={setNewReservationForm}
                        setTablesData={setTablesData}
                        setShowTables = {setShowTables}
                    />
                </div>}
            
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
