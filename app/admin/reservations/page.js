"use client";
import { useEffect, useState, useRef } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSideBar from "../components/AdminSideBar";
import OrdersPagination from "../components/orders/OrdersPagination";
import TablesDraggableBox from "../components/Tables/TablesDraggableBox";
import { GetReservations, HandleTableLayout } from "@/libs/apifunctions/handleReservation";
import ReservationUpdateForm from "../components/reservations/forms/ReservationUpdateForm";
import { AddTableForm, EditTableForm } from "../components/reservations/forms/FormStructures";
import MakeReservation from "../components/reservations/MakeReservation";
import ReservationList from "../components/reservations/ReservationsList";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SessionChecker } from "@/libs/sessionChecker";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { getLocalDate, getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";

export default function ReservationPage() {
  const [tablesdata, setTablesData] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [tablesStatus, setTablesStatus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({ addTable: false, editTable: false });
  const [layoutEditMode, setLayoutEditMode] = useState(false);
  const [TableLayout, setTableLayout] = useState([]);
  const [newTable, setNewTable] = useState({ TableID: "", TableName: "", ChairSize: 0 });
  const [chairToEdit, setChairToEdit] = useState({});
  const [selectedTables, setSelectedTables] = useState([]);
  const { data: session, status } = useSession();
  const [permission, setPermission] = useState(false);
  const initialTablesRef = useRef([]);
  
  const [newReservationForm, setNewReservationForm] = useState({
    ReservationDate: getLocalDate_YMD(),
    ReservationTime: getLocalTime(),
    selectedTables: selectedTables,
    TableID_list: selectedTables.map((table) => table.TableID),
    Reservation_type: "reserved",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role === "Customer") {
      redirect("/");
      return;
    }
    async function GetSessionCheck() {
      const hasPermission = await SessionChecker(session, "/admin/reservations");
      setPermission(hasPermission);
      if (!hasPermission) redirect("/");
    }
    GetSessionCheck();
  }, [session, status]);

  // console.log(getLocalTime(),new Date().toLocaleTimeString("en-GB", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // }))

  useEffect(() => {
    async function fetchData() {
      try {
        const reservation_data = await GetReservations();
        setReservationData(reservation_data.reservations);
        // console.log(reservation_data.reservations);
        const res = await HandleUsers({
          mode: "get",
          item_type: "reservedTables",
          data: {
            ReservationDate: newReservationForm.ReservationDate,
            ReservationTime: newReservationForm.ReservationTime,
          },
        });
        setTablesData(res)
        console.log({res})
        initialTablesRef.current = reservation_data.tables;
      } catch (error) {
        console.log(error);
      }
    }
    if (session && permission) {
      fetchData();
    }
  }, [session, permission]);

  useEffect(() => {
    async function GetReservedTables() {
      const res = await HandleUsers({
        mode: "get",
        item_type: "reservedTables",
        data: {
          ReservationDate: newReservationForm.ReservationDate,
          ReservationTime: newReservationForm.ReservationTime,
        },
      });
      setTablesData(res)
      // console.log({ res });
    }
    GetReservedTables();
  }, [newReservationForm.ReservationDate, newReservationForm.ReservationTime]);


  if (status === "loading" || permission === null) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }
  if (!session || !permission) {
    return null;
  }

  const handleAddTable = () => {
    if (!newTable.TableID || !newTable.TableName) {
      alert("Please provide a valid Name.");
      return;
    }
    setTablesData((prevTables) => [...prevTables, newTable]);
    setNewTable({ TableID: "", TableName: "", ChairSize: 0 });
    setIsModalOpen({ ...isModalOpen, addTable: false });
  };

  async function handleChairEdit({ id, name, chairsSize, floor, chairOrientation, X_Coordinate, Y_Coordinate }) {
    setChairToEdit({
      TableID: id,
      TableName: name,
      Floor_Value: floor,
      ChairSize: chairsSize,
      ChairOrientation: chairOrientation,
      X_Coordinate,
      Y_Coordinate,
    });
    setIsModalOpen({ ...isModalOpen, editTable: true });
  }

  
  return (
    <div className="relative w-[100vw] h-[100vh] flex ">
      <div className="w-[15%] h-full flex justify-center">
        <AdminSideBar AdminOption={"reservations"} />
      </div>
      <div className="w-[85%] h-full flex flex-col gap-2 ">
        <AdminHeader showSearch={false} headlingLabel={"Reservations"}  />
        
        <div className="w-full h-[calc(100vh-100px)] flex">
        <div className="w-1/2 h-full ">
            <div className="w-full h-[55%]">
            {tablesdata && 
                <TablesDraggableBox 
                Editmode={layoutEditMode}
                setLayoutEditMode={setLayoutEditMode}
                tablesStatus={tablesStatus}
                tables={tablesdata}
                setTablesData={setTablesData}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                setSelectedTables={setSelectedTables}
                selectedTables={selectedTables}   
                handleChairEdit={handleChairEdit}    
                newReservationForm={newReservationForm}
                displayMode={"admin"}       
                />
            }
            {/* {console.log(selectedTables)} */}
            </div>
            <div className="bg-orange-50 border-2 border-t-0 
                    border-orange-300 h-[45%] w-full">
                <MakeReservation 
                       selectedTables={selectedTables}
                       setSelectedTables={setSelectedTables}
                       newReservationForm={newReservationForm}
                       setNewReservationForm={setNewReservationForm}
                       setReservationData={setReservationData}
                       setTablesData={setTablesData}
                />
            </div>
        </div>
        <div className=" w-1/2 h-full">
            
              <ReservationList 
                    reservationData={reservationData} 
                    setReservationData={setReservationData}
                    setTablesData={setTablesData}
            />
        </div>
        </div>
        
      </div>
      {isModalOpen.addTable && (
        <ReservationUpdateForm
        formConfig={AddTableForm} 
        isOpen={isModalOpen}
        mode={"insert"}
        item_type={"table"}
        onClose={() => setIsModalOpen({...isModalOpen,addTable:false})} 
        setTablesData={setTablesData}
        newReservationForm={newReservationForm}
        />
      )}
      {isModalOpen.editTable && (
        <ReservationUpdateForm
        formConfig={EditTableForm} 
        isOpen={isModalOpen}
        initialData={chairToEdit}
        mode={"update"}
        item_type={"table"}
        onClose={() => setIsModalOpen({...isModalOpen,editTable:false})} 
        setTablesData={setTablesData}
        />
      )}

      
    </div>
  );
}