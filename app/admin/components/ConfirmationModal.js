import React, { useState } from "react";

export default function ConfirmationModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  delete_item,
}) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onConfirm({ ...delete_item, password }); // Include password inside delete_item
  };
  console.log(delete_item)
  return (
    <div className="absolute w-[100vw] h-[100vh] bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <p className="text-gray-800 text-lg mb-4">
      {delete_item.data.number > 0
        ? `This ${delete_item.data.type} - ${delete_item.data.name} has ${delete_item.data.number} ${delete_item.data.dependent_name}, please delete the ${delete_item.data.dependent_name} first`
        : `Are you sure you want to delete ${delete_item.data.type} - ${delete_item.data.name}`}
    </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              // required
            /> */}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm Deletion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
