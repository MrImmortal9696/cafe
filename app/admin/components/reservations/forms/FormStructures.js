import { getLocalDate_YMD, getLocalTime } from "@/libs/hourFormat";

export const AddTableForm = [
    // {title:"Table ID",field:"TableID",type:"",data:"",readOnly:true,placeholder:"This value is autogenerated"},
    {title:"Table name",field:"TableName",type:"text",data:"",readOnly:false,placeholder:"Please Enter like T-4 And do not repeat names"},
    // {title:"No. of chairs",field:"ChairSize",type:"number",data:"",readOnly:false,placeholder:"Please enter no. of chairs min-2 max-22"},
    {title:"Floor Value",field:"Floor_Value",type:"number",data:"",readOnly:false,placeholder:"Floor for the chair location"},
]
export const EditTableForm = [
    {title:"Table ID",field:"TableID",type:"",data:"",readOnly:true,placeholder:"This value is autogenerated"},
    {title:"Table name",field:"TableName",type:"text",data:"",readOnly:false,placeholder:"Please Enter like T-4"},
    {title:"Floor Value",field:"Floor_Value",type:"number",data:"",readOnly:false,placeholder:"Floor for the chair location"},
    {title:"Password",field:"password",type:"password",data:"",readOnly:false,placeholder:"Enter password"},
    // {title:"Chair Orientation",field:"ChairOrientation",type:"select",
    //     dropdownOptions:[
    //         {label:"vertical",type:"number", value:90 },
    //         {label:"horizontal",type:"number",value:0},
    //     ]
    // }
]

export const AddReservationForm = [
    {
      title: "Date",
      field: "ReservationDate",
      type: "date",
      data: new Date().toISOString().split("T")[0], // Prefills with today's date in 'YYYY-MM-DD' format
    },
    {
      title: "Time",
      field: "ReservationTime",
      type: "time",
      data: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }), // Prefills with the current time in 'HH:mm' format (24-hour)
    },
    { title: "Number of Guests", field: "NumberOfGuests", type: "number", data: "", min: 1, max: 22 }, // Min 1 guest, max 20 
    { title: "Name", field: "CustomerName", type: "text", data: "" },
    { title: "Email", field: "CustomerEmail", type: "email", data: "" },
    { title: "Phone Number", field: "CustomerPhone", type: "number", data: "" },
    { title: "Note", field: "Preferences", type: "text", data: "",span:3 },
  ];
  
  export const AddCustomerReservationForm = [
    { title: "Name", field: "CustomerName", type: "text", data: "" },
    { title: "Email", field: "CustomerEmail", type: "email", data: "" },
    { title: "Phone Number", field: "CustomerPhone", type: "number", data: "", min: 1000000000, max: 9999999999 }, // Assuming 10-digit phone number
    {
        title: "Date",
        field: "ReservationDate",
        type: "date",
        data: getLocalDate_YMD(), // Prefills with today's date
    },
    {
        title: "Time",
        field: "ReservationTime",
        type: "time",
        data: getLocalTime()
    },
    { title: "Number of Guests", field: "NumberOfGuests", type: "number", data: "", min: 1, max: 22 }, // Min 1 guest, max 20
    { title: "Note", field: "Preferences", type: "text", data: "", span: 3 },
];




  