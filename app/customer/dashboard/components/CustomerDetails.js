import { useEffect, useState } from "react";
import RecentOrders from "./RecentOrders";
import RecentReservations from "./RecentReservations";
import { MdEdit, MdDone } from "react-icons/md";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";

export const CustomerDetailsUpdateForm = [
  { title: "Name", field: "CustomerName", type: "text", span: 1 },
  { title: "Email", field: "CustomerEmail", type: "email", span: 1 },
  { title: "Phone", field: "Phone", type: "number", span: 1 },
  { title: "Password", field: "Customer_Password", type: "text", span: 1 },
  { title: "Address", field: "Address", type: "text", span: 2 },
];

export default function CustomerDetails({ customer,setCustomerData, recentOrders, recentReservations }) {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ ...customer });

  useEffect(() => {
    setFormData({ ...customer }); // Sync formData with customer prop
  }, [customer]);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    
  };

  async function handleSubmit () {
    console.log("Updated Customer Data:", formData);
    const update_res = await HandleUsers({mode:"update",item_type:"customer_dashboard",data:formData})
    const res = await HandleUsers({
      mode:"get",
      item_type:"customer_dashboard",
      data:{CustomerEmail:customer.CustomerEmail
      }}) 
  
    setCustomerData(res[0]?.CustomerData)
    // setCustomerData({...customer,CustomerDetails:formData})
  };

  return (
    <div className="w-full h-full p-4">
      {/* Edit Mode Toggle */}
      <div className="flex justify-between mb-4">
        <span className="font-bold text-lg">Personal Details</span>
        <button
          onClick={() => {
            if (editMode) handleSubmit(); // Log data when toggling off edit mode
            setEditMode((prev) => !prev);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          {editMode ? <MdDone /> : <MdEdit />}
        </button>
      </div>

      {/* Customer Details Section */}
      <div className="lg:grid grid-cols-3 flex w-full flex-col lg:min-h-[20%] h-auto gap-4">
        {editMode
          ? CustomerDetailsUpdateForm.map((field, index) => (
              <div key={index} className={`col-span-${field.span}`}>
                <label className="font-semibold lg:text-lg text-sm opacity-70">{field.title}</label>
                <input
                  type={field.type}
                  value={formData[field.field] ?? ""}
                  onChange={(e) => handleInputChange(e, field.field)}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
            ))
          : [
              { label: "Name", value: customer?.CustomerName, span: 1 },
              { label: "Email", value: customer?.CustomerEmail, span: 1 },
              {
                label: "Password",
                value: customer?.Customer_Password || "••••••••",
                span: 1,
                isPassword: true,
              },
              { label: "Phone", value: customer?.Phone, span: 1 },
              { label: "Address", value: customer?.Address, span: 2 },
            ].map((item, index) => (
              <div key={index} className={`col-span-${item.span}`}>
                <div className="font-semibold lg:text-lg text-sm opacity-70">{item.label}</div>
                <div
                  className="font-medium lg:text-lg text-sm cursor-pointer"
                  onMouseEnter={() => item.isPassword && setShowPassword(true)}
                  onMouseLeave={() => item.isPassword && setShowPassword(false)}
                >
                  {item.isPassword ? (showPassword ? customer?.Customer_Password : "••••••••") : item.value}
                </div>
              </div>
            ))}
      </div>

      {/* Recent Orders Section */}
      <div className="w-full flex flex-col gap-2 mt-6">
        <span className="text-lg font-semibold">Recent Orders</span>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
          {recentOrders?.map((item, index) => (
            <RecentOrders order={item} key={index} />
          ))}
        </div>
      </div>

      {/* Recent Reservations Section */}
      <div className="w-full flex flex-col gap-2 mt-6">
        <span className="text-lg font-semibold">Recent Reservations</span>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
          {recentReservations?.map((item, index) => (
            <RecentReservations reservation={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
