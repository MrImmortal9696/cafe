"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import AllSideChair from "./elements/icons/AllSideChair";
import ReservationUpdateForm from "../reservations/forms/ReservationUpdateForm";
import { AddTableForm } from "../reservations/forms/FormStructures";
import { IoMdAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { HandleReservation, HandleTableLayout } from "@/libs/apifunctions/handleReservation";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { FaCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { PiStairsDuotone } from "react-icons/pi";
import { FaDoorOpen } from "react-icons/fa"


const Draggable = ({ 
  id, 
  onDragEnd, 
  parentRef,
  Editmode,
  initialX,
  initialY,
  name,
  ChairSize = 0,
  setSelectedTables,
  selectedTables,
  floor,
  handleChairEdit,
  chairRotation,
  state,
  deleteMode,
  setTablesData,
  newReservationForm
}) => {
  const [position, setPosition] = useState({ x: initialX || 0, y: initialY || 0 });
  const positionRef = useRef({ x: initialX || 0, y: initialY || 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chairsSize, setChairSize] = useState(ChairSize);
  const [chairOrientation, setChairOrientation] = useState(chairRotation);

  // useEffect(() => {
  //   if (parentRef.current && elementRef.current) {
  //     const parent = parentRef.current.getBoundingClientRect();
  //     const element = elementRef.current.getBoundingClientRect();

  //     // Adjust initial position to place the element's center at the specified coordinates
  //     const adjustedX = (initialX || 0) + parent.width / 2 - element.width / 2;
  //     const adjustedY = (initialY || 0) + parent.height / 2 - element.height / 2;

  //     positionRef.current = { x: adjustedX, y: adjustedY };
  //     setPosition({ x: adjustedX, y: adjustedY });
  //   }
  // }, [parentRef, initialX, initialY]);

  const handleMouseDown = (e) => {
    if (!Editmode) return;
    setIsDragging(true);
    // Store the offset from the mouse down position
    offsetRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !parentRef.current || !elementRef.current || !Editmode) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();

    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;

    // Keep the draggable element within the parent bounds
    newX = Math.round(Math.max(0, Math.min(newX, parentRect.width - elementRect.width)));
    newY = Math.round(Math.max(0, Math.min(newY, parentRect.height - elementRect.height)));

    // Update the positionRef
    positionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!Editmode) return;
    setIsDragging(false);
    // Pass the final positionRef values to onDragEnd
    if (onDragEnd) {
      onDragEnd({
        id,
        position: positionRef.current,
        ChairSize: chairsSize,
        chairOrientation,
      });
    }
  };

  async function handleDeleteTable(TableID) {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this table?");
    console.log(TableID)
    if (isConfirmed) {
        // Proceed with the deletion if confirmed
        await HandleTableLayout({
            mode: "delete",
            item_type: "table",
            data: { TableID:TableID },
        });
        console.log({ TableID });
        const res = await HandleUsers({
          mode: "get",
          item_type: "reservedTables",
          data: {
            ReservationDate: newReservationForm?.ReservationDate,
            ReservationTime: newReservationForm?.ReservationTime,
          },
        })
  
      setTablesData(res)
    
        
    
    } else {
        // Log if the user cancels the deletion
        console.log("Table deletion was canceled.");
    }
}


  const handleChairIncrement = () => {
    const updatedChairSize = Math.min(chairsSize + 1, 10); // Max limit for chair size
    setChairSize(updatedChairSize);
    onDragEnd({ id, position: positionRef.current, ChairSize: updatedChairSize, chairOrientation });
  };

  const handleChairDecrement = () => {
    const updatedChairSize = Math.max(chairsSize - 1, 0); // Min limit for chair size
    setChairSize(updatedChairSize);
    onDragEnd({ id, position: positionRef.current, ChairSize: updatedChairSize, chairOrientation });
  };

  const handleRotate = () => {
    const updatedChairRotation = (chairOrientation + 90) % 180;
    setChairOrientation(updatedChairRotation);
    onDragEnd({ id, position: positionRef.current, ChairSize: chairsSize, chairOrientation: updatedChairRotation });
  };

  useEffect(() => {
    const parentElement = parentRef.current;
    if (!parentElement) return;

    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const SelectTable = (id, name) => {
    // console.log({state})
    const exists = selectedTables?.some((table) => table.TableID === id);
    if (!exists && selectedTables.length < 9 && !Editmode && state === "available" && !deleteMode) {
      setSelectedTables([...selectedTables, { TableID: id, TableName: name }]);
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "grab",
        userSelect: "none",
      }}
      onClick={() => SelectTable(id, name)}
      // onClick={()=>console.log({position})}
      className="  "
    >
      <div>
        <AllSideChair 
          Editmode={Editmode}
          name={name}
          ChairSize={chairsSize}
          floor={floor}
          id={id}
          X_Coordinate={positionRef.current.x}
          Y_Coordinate={positionRef.current.y}
          handleChairEdit={handleChairEdit}
          setChairOrientation={setChairOrientation}
          chairOrientation={chairOrientation}
          chairsSize={chairsSize}
          setChairSize={setChairSize}
          handleChairIncrement={handleChairIncrement}
          handleChairDecrement={handleChairDecrement}
          handleRotate={handleRotate}
          state={state}
          deleteMode={deleteMode}
          handleDeleteTable={handleDeleteTable}
        />
      </div>
    </div>
  );
};




export default function TablesDraggableBox({ 
  Editmode = false, 
  components, 
  tables, 
  tablesStatus,
  setTablesData,
  setIsModalOpen,
  isModalOpen,
  setLayoutEditMode,
  setSelectedTables,
  selectedTables,
  handleChairEdit,
  setTableLayout,
  newReservationForm,
  displayMode = "landing"
}) {
  const parentRef = useRef(null);
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });

  const [currentFloor, setCurrentFloor] = useState(1);
  const [tableStates, setTablesStates] = useState(tables);
  const [deleteMode,setDeleteMode] = useState(false)
  const initialStatesRef = useRef(tables);

  const floors = useMemo(() => [...new Set(tables.map((table) => table.Floor_Value))], [tables]);

  useEffect(() => {
    initialStatesRef.current = tables;
    setTablesStates(tables);
  }, [tables]);

  const handleDragEnd = ({ id, position, ChairSize, chairOrientation }) => {
    setTablesStates((prevTables) =>
      prevTables.map((table) =>
        table.TableID === id
          ? { ...table, X_Coordinate: position.x, Y_Coordinate: position.y, ChairSize, ChairOrientation: chairOrientation }
          : table
      )
    );
  };

 

  async function handleDoneEditing() {
    if (displayMode === "admin") {
      const initialStates = initialStatesRef.current;
      const changes = tableStates.filter((table, index) => {
        const initial = initialStates[index];
        return (
          table.X_Coordinate !== initial.X_Coordinate ||
          table.Y_Coordinate !== initial.Y_Coordinate ||
          table.ChairOrientation !== initial.ChairOrientation ||
          table.ChairSize !== initial.ChairSize
        );
      });
      

      if (changes.length > 0) {
        await HandleTableLayout({ mode: "auto-update", item_type: "table", data: changes });
        if(displayMode === "admin"){
          const res = await HandleUsers({
            mode: "get",
            item_type: "reservedTables",
            data: {
              ReservationDate: newReservationForm?.ReservationDate,
              ReservationTime: newReservationForm?.ReservationTime,
            },
          })
    
        setTablesData(res)}
      }
     

      // console.log("Modified tables", changes);
    } 
  }
  async function handleDelete(TableID){
    setDeleteMode(false)
    console.log("Deleting table : ",TableID)
    // await HandleReservation({mode:"delete",item_type:"table",data:{TableID}})
  }

  // Panning functions
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !parentRef.current || !Editmode) return;

    const dx = e.clientX - lastMousePositionRef.current.x;
    const dy = e.clientY - lastMousePositionRef.current.y;

    parentRef.current.scrollLeft -= dx;
    parentRef.current.scrollTop -= dy;

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  useEffect(() => {
    const viewport = viewportRef.current;
    const content = viewport?.querySelector('div');
    if (!viewport || !content) return;

    // Calculate the initial scroll position to center the content
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const viewportWidth = viewport.offsetWidth;
    const viewportHeight = viewport.offsetHeight;

    // Set scroll position to the center of the content
    const scrollLeft = (contentWidth - viewportWidth) / 2;
    const scrollTop = (contentHeight - viewportHeight) / 2;

    viewport.scrollLeft = scrollLeft;
    viewport.scrollTop = scrollTop;

    viewport.addEventListener("mousemove", handleMouseMove);
    viewport.addEventListener("mouseup", handleMouseUp);
    viewport.addEventListener("mouseleave", handleMouseUp);

    return () => {
      viewport.removeEventListener("mousemove", handleMouseMove);
      viewport.removeEventListener("mouseup", handleMouseUp);
      viewport.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative h-full w-full flex  flex-col">
      {/* Scrollable & Pannable Viewport */}
      <div
        ref={viewportRef}
        className={`relative  w-full h-full   overflow-scroll no-scrollbar 
          ${displayMode === "admin" ? "border-2 border-orange-300 rounded-t-none" :"" } rounded-xl`}
        style={{
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          backgroundImage: Editmode
            ? `linear-gradient(to right, rgba(0,0,0, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0, 0.3) 1px, transparent 1px)`
            : "none",
          backgroundSize: Editmode ? "20px 20px" : "none",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Hide scrollbar for WebKit browsers */}
       

        {/* Large Draggable Area */}
        <div
        ref={parentRef}
        className="relative  scale-[60%] mx-auto   lg:scale-100 w-[900px] h-[900px] "
          // style={{
          //   background: "radial-gradient(circle, rgba(255,255,255,1) 2%, rgba(0,0,0,0.2) 100%)",
          // }}
        >
          <div className="w-full grid grid-cols-3">
            <div></div>
            <div className="flex gap-4 py-4 flex-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-blue-500">
                  <span className="text-blue-200"><FaCircle/></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold text-red-400">
                  <span className="text-red-200"><FaCircle/></span>
                  <span>Reserved</span>
                </div>
            </div>

            <div className="flex justify-end items-end px-4">
              { currentFloor === 1 &&
                <div className="flex gap-1 items-center">
                  <span className="text-4xl"><FaDoorOpen/></span>
                  <span className="font-semibold">Entrance</span>
              </div>
              }
              { currentFloor === 2 &&
                <div className="flex gap-1 items-center">
                  <span className="text-4xl"><PiStairsDuotone/></span>
                  <span className="font-semibold">Stairs</span>
              </div>
              }
            </div>

          </div>
          

          {Editmode && <div><FaCircle/></div>}
          {tables
            .filter((table) => table.Floor_Value === currentFloor)
            .map((comp) => (
              <Draggable
                key={comp.TableID}
                id={comp.TableID}
                onDragEnd={handleDragEnd}
                parentRef={parentRef}
                Editmode={Editmode}
                initialX={comp.X_Coordinate}
                initialY={comp.Y_Coordinate}
                state={comp.TableStatus?.toLowerCase() || "available"}
                name={comp.TableName}
                ChairSize={comp.ChairSize}
                setSelectedTables={setSelectedTables}
                selectedTables={selectedTables}
                handleChairEdit={handleChairEdit}
                floor={comp.Floor_Value}
                chairRotation={comp.ChairOrientation}
                deleteMode={deleteMode}
                setTablesData={setTablesData}
                newReservationForm={newReservationForm}
              />
            ))}
        </div>
      </div>

      {/* Edit and Add Buttons */}
      {displayMode === "admin" && (
        <div className="absolute bg-orange-50 border-2 border-b-0 border-orange-300 bottom-0 flex gap-2 p-2 rounded-t-xl text-[28px]">
          <button
            className="hover:bg-white rounded-full text-center p-2"
            onClick={() => setIsModalOpen({ ...isModalOpen, addTable: true })}
          >
            <IoMdAddCircle />
          </button>
          <button
            className={`${
              Editmode ? "bg-green-500 hover:bg-green-600 text-white " : "hover:bg-white"
            } rounded-full text-center p-2`}
            onClick={() => {
              if (Editmode) handleDoneEditing();
              setLayoutEditMode((prev) => !prev);
            }}
          >
            {Editmode ? <MdDone /> : <MdEdit />}
          </button>
          <button
            className={`${
              deleteMode ? "bg-green-500 hover:bg-green-600 text-white " : "hover:bg-white text-red-400"
            } rounded-full text-center p-2`}
            onClick={() => {
              setDeleteMode((prev)=>!prev)
            }}
          >
            {deleteMode ? <MdDone /> : <MdDelete />}
          </button>
        </div>
      )}

      {/* Floor Selection */}
      <div className="absolute flex-col right-0 bg-orange-50 border-2 
      rounded-t-lg overflow-clip border-b-0 border-orange-300 
      bottom-0 flex lg:text-[18px] text-[12px]">
        {floors?.map((floor, index) => (
          <div
            key={index}
            onClick={() => setCurrentFloor(floor)}
            className={`${
              currentFloor === floor ? "bg-orange-200 shadow-lg " : " hover:bg-orange-100"
            } w-full p-2  px-3 lg:px-4`}
          >
            {floor}
          </div>
        ))}
      </div>
      
    </div>
  );
}