"use client";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useState, useEffect } from "react";
import { MdEdit, MdDone, MdDelete } from "react-icons/md";

export default function UsersListItem({ user, rolesData, setUsersData }) {
  const [updatedData, setUpdatedData] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedData(user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!updatedData.FullName.trim()) {
      newErrors.FullName = "Full Name is required";
    }
  
    if (updatedData.PasswordHash) {
      if (updatedData.PasswordHash.length < 6) {
        newErrors.PasswordHash = "Password must be at least 6 characters";
      } else if (!/(?=.*[A-Z])(?=.*\d)/.test(updatedData.PasswordHash)) {
        newErrors.PasswordHash = "Password must contain at least one uppercase letter and one number";
      }
    }
  
    if (!updatedData.role_id) {
      newErrors.role_id = "Please select a role";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleEdit = async () => {
    if (!validate()) return;

    setEditMode(false);
    await HandleUsers({ mode: "update", item_type: "users", data: updatedData });

    const users_res = await HandleUsers({ mode: "get", item_type: "users", data: { Email: null } });
    setUsersData(users_res);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${updatedData.FullName}"?`);
    if (confirmDelete) {
      await HandleUsers({ mode: "delete", item_type: "users", data: { UserID: updatedData.UserID } });

      const users_res = await HandleUsers({ mode: "get", item_type: "users", data: { Email: null } });
      setUsersData(users_res);
    }
  };

  return (
    <div className="grid my-2 grid-cols-6 text-center font-semibold items-center gap-2">
      <span>{updatedData.UserID}</span>

      <div>
        {editMode ? (
          <>
            <input
              type="text"
              name="FullName"
              value={updatedData.FullName}
              onChange={handleInputChange}
              className={`p-2 border ${errors.FullName ? "border-red-500" : "border-gray-300"} rounded-lg text-center`}
            />
            {errors.FullName && <p className="text-red-500 text-xs">{errors.FullName}</p>}
          </>
        ) : (
          <span>{updatedData.FullName}</span>
        )}
      </div>

      <div>
        <span>{updatedData.Email}</span>
      </div>

      <div>
        {editMode ? (
          <>
            <input
              type="text"
              name="PasswordHash"
              value={updatedData.PasswordHash}
              onChange={handleInputChange}
              className={`p-2 border ${errors.PasswordHash ? "border-red-500" : "border-gray-300"} rounded-lg text-center`}
            />
            {errors.PasswordHash && <p className="text-red-500 text-xs">{errors.PasswordHash}</p>}
          </>
        ) : (
          <span>••••••</span>
        )}
      </div>

      <div>
        {editMode ? (
          <>
            <select
              name="role_id"
              value={updatedData.role_id || ""}
              onChange={handleInputChange}
              className={`p-2 border ${errors.role_id ? "border-red-500" : "border-gray-300"} rounded-lg text-center`}
            >
              <option value="">Select a role</option>
              {rolesData.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role_id && <p className="text-red-500 text-xs">{errors.role_id}</p>}
          </>
        ) : (
          <span className="mt-1 text-gray-600">
            {rolesData.find((role) => role.id == updatedData.role_id)?.name || "-"}
          </span>
        )}
      </div>

      <div className="flex-center gap-4">
        <button onClick={() => (!editMode ? setEditMode(true) : handleEdit())}>
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
        <button onClick={handleDelete}>
          <span className="bg-red-500 text-white flex p-2 text-2xl rounded-full w-full">
            <MdDelete />
          </span>
        </button>
      </div>
    </div>
  );
}
