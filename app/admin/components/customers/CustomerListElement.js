import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useEffect, useState } from "react";
import { MdEdit, MdDone, MdDelete } from "react-icons/md";

export default function CustomerListElement({ customer }) {
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedCustomer, setUpdatedCustomer] = useState(customer);

  useEffect(()=>{
    setUpdatedCustomer(customer)
  },[customer])

  async function handleEdit() {
    // console.log(updatedCustomer);
    // Add API call or logic to save the updated customer here
    await HandleUsers({mode:"update",item_type:"customer",data:updatedCustomer})
  }

  async function handleDelete() {
    const isConfirmed = window.confirm(`Are you sure you want to delete Customer Email: ${customer.CustomerEmail}?`);
    if (isConfirmed) {
      await HandleUsers({ mode: "delete", item_type: "customer", data: { CustomerID: customer.CustomerID } });
      alert(`Customer Email: ${customer.CustomerEmail} has been deleted successfully.`);
    }
  }
  

  function handleChange(field, value) {
    setUpdatedCustomer((prev) => ({ ...prev, [field]: value }));

  }

  return (
    <div className="grid grid-cols-11 text-center border-b p-2">
      {/* Customer ID */}
      <div>
        <span>{updatedCustomer.CustomerID}</span>
      </div>

      {/* Customer Name */}
      <div className="col-span-1">
        {editMode ? (
          <input
            className="border mx-1 p-1 w-[90%] rounded"
            value={updatedCustomer.CustomerName}
            onChange={(e) => handleChange("CustomerName", e.target.value)}
          />
        ) : (
          <span>{updatedCustomer.CustomerName}</span>
        )}
      </div>

      {/* Customer Email */}
      <div className="col-span-2">
        <span>{updatedCustomer.CustomerEmail}</span>
      </div>

      {/* Customer Password */}
      <div
        className="flex flex-col cursor-pointer"
        onMouseEnter={() => setShowPassword(true)}
        onMouseLeave={() => setShowPassword(false)}
      >
        {editMode ? (
          <input
            className="border mx-1 p-1 w-[90%] rounded"
            type="text"
            value={updatedCustomer.Customer_Password}
            onChange={(e) => handleChange("Customer_Password", e.target.value)}
          />
        ) : (
          <span>{showPassword ? updatedCustomer.Customer_Password : "********"}</span>
        )}
      </div>

      {/* Phone */}
      <div>
        {editMode ? (
          <input
            className="border mx-1 p-1 w-[90%] rounded"
            value={updatedCustomer.Phone}
            onChange={(e) => handleChange("Phone", e.target.value)}
          />
        ) : (
          <span>{updatedCustomer.Phone}</span>
        )}
      </div>

      {/* Address */}
      <div className="col-span-2">
        {editMode ? (
          <input
            className="border mx-1 p-1 w-full rounded "
            value={updatedCustomer.Address || ""}
            onChange={(e) => handleChange("Address", e.target.value)}
          />
        ) : (
          <span>{updatedCustomer.Address || "-"}</span>
        )}
      </div>

      {/* Loyalty Points */}
      <div>
        {editMode ? (
          <input
            className="border mx-1 p-1 w-[90%] rounded"
            type="number"
            value={updatedCustomer.LoyaltyPoints}
            onChange={(e) => handleChange("LoyaltyPoints", e.target.value)}
          />
        ) : (
          <span>{updatedCustomer.LoyaltyPoints}</span>
        )}
      </div>

      {/* Wallet Balance */}
      <div>
        {editMode ? (
          <input
            className="border mx-1 p-1 w-[90%] rounded"
            type="number"
            value={updatedCustomer.WalletBalance}
            onChange={(e) => handleChange("WalletBalance", e.target.value)}
          />
        ) : (
          <span>{updatedCustomer.WalletBalance}</span>
        )}
      </div>

      {/* Edit and Delete Buttons */}
      <div className="flex-center gap-4">
        <button
          onClick={() => {
            if (!editMode) {
              setEditMode(true);
            } else {
              handleEdit();
              setEditMode(false);
            }
          }}
        >
          {!editMode ? (
            <span className="bg-zinc-200 flex p-2 text-2xl rounded-full w-full">
              <MdEdit />
            </span>
          ) : (
            <span className="bg-green-400 text-white flex p-2 text-2xl rounded-full w-full">
              <MdDone />
            </span>
          )}
        </button>
        <button onClick={() => handleDelete()}>
          <span className="bg-red-500 text-white flex p-2 text-2xl rounded-full w-full">
            <MdDelete />
          </span>
        </button>
      </div>
    </div>
  );
}
