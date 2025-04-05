"use client";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useState } from "react";
import { MdDone, MdDelete, MdEdit } from "react-icons/md";

export default function TaxRow({ tax, index, onUpdate, onDelete }) {
    const [editMode, setEditMode] = useState(false);
    const [updatedTax, setUpdatedTax] = useState({ ...tax });

    const handleChange = (field, value) => {
        setUpdatedTax((prev) => ({ ...prev, [field]: value }));
    };

    async function handleSave() {
        setEditMode(false);
        onUpdate(index, updatedTax);
        // console.log(updatedTax);

        await HandleUsers({
            mode: "update",
            item_type: "update_tax",
            data: { ...updatedTax }
        });
    }

    async function DeleteTax() {
        const confirmed = window.confirm("Are you sure you want to delete this tax?");
        if (!confirmed) return;

        await HandleUsers({
            mode: "delete",
            item_type: "delete_tax",
            data: { TaxID: tax.TaxID }
        });

        onDelete(tax.TaxID);
    }

    return (
        <div className="grid grid-cols-5 items-center gap-2 border-b-2 border-b-zinc-200 py-2">
            <span>{index + 1}</span>

            {editMode ? (
                <>
                    <input
                        type="text"
                        value={updatedTax.TaxName}
                        onChange={(e) => handleChange("TaxName", e.target.value)}
                        className="border p-1 rounded"
                    />
                    <input
                        type="number"
                        value={updatedTax.TaxPercentage}
                        onChange={(e) => handleChange("TaxPercentage", e.target.value)}
                        className="border p-1 rounded"
                    />
                    <select
                        value={updatedTax.Active}
                        onChange={(e) => handleChange("Active", Number(e.target.value))}
                        className="border p-1 rounded"
                    >
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </>
            ) : (
                <>
                    <span className="font-semibold">{tax.TaxName}</span>
                    <span >{tax.TaxPercentage} %</span>
                    <span>{tax.Active === 1 ? "Yes" : "No"}</span>
                </>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => (editMode ? handleSave() : setEditMode(true))}
                    className={`text-white ${editMode ? "bg-green-500" : "bg-orange-400"} p-2 rounded-full`}
                >
                    {editMode ? <MdDone /> : <MdEdit />}
                </button>
                <button onClick={DeleteTax} className="bg-red-500 text-white p-2 rounded-full">
                    <MdDelete />
                </button>
            </div>
        </div>
    );
}
