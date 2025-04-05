import { useState, useEffect } from "react";
import { FinanceDetailsUpdateForm } from "../users/forms/FormStructures";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { MdDone, MdDelete, MdEdit } from "react-icons/md";



export default function FinanceForm() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [financeData, setFinanceData] = useState({});
  const [isChanged, setIsChanged] = useState(false); // ✅ Flag to track changes

  useEffect(() => {
    async function GetFinanceData() {
      const res = await HandleUsers({ mode: "get", item_type: "finance_dashbaord", data: {} });
      setFormData(res[0]);
      setFinanceData(res[0]); // Store original data for comparison
    }
    GetFinanceData();
  }, []);

  const handleChange = (e, field) => {
    const newValue = e.target.value;
    
    // Check if value is different from original data
    if (financeData[field] !== newValue) {
      setIsChanged(true);
    } else {
      setIsChanged(Object.keys(financeData).some(key => financeData[key] !== formData[key]));
    }

    setFormData({ ...formData, [field]: newValue });
  };

  const handleSave = async () => {
    if (!isChanged) {
      setEditMode(false);
      return;
    }

    console.log("Saving data:", formData);
    await HandleUsers({ mode: "update", item_type: "financeDashboard", data: formData });

    const res = await HandleUsers({ mode: "get", item_type: "finance_dashbaord", data: {} });
    setFinanceData(res[0]); // Update original data
    setEditMode(false);
    setIsChanged(false); // Reset change flag
  };

  return (
    <div className="border rounded-lg p-8 bg-white w-full max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Finance Details</h2>
        <button
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          className={`${editMode ? "bg-green-500" : "bg-orange-400"} p-2 rounded-full text-white`}
        >
          {editMode ? <MdDone /> : <MdEdit />}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {FinanceDetailsUpdateForm.map(({ title, field, type }) => (
          <div key={field} className=" px-2 border-b-2 border-zinc-200">
            <label className="block text-gray-700 font-medium">{title}</label>
            {editMode ? (
              <input
                type={type}
                value={formData[field] || ""}
                onChange={(e) => handleChange(e, field)}
                className="w-full border px-3 py-2 rounded-md bg-zinc-50 focus:outline-orange-400"
              />
            ) : (
              <p className="text-gray-900 font-semibold">{financeData[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
