"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { MdDone } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import TaxRow from "./TaxRow";

export default function TaxesFinanceForm() {
    const { TaxesList } = useCart();
    const [taxesForm, setTaxesForm] = useState(TaxesList);
    const [originalTaxes, setOriginalTaxes] = useState(TaxesList); // Store original for comparison
    const [addMode, setAddMode] = useState(false);
    const [newTax, setNewTax] = useState({ TaxName: "", TaxPercentage: "", Active: 1 });
    const [isChanged, setIsChanged] = useState(false); // Track changes

    useEffect(() => {
        if (taxesForm !== TaxesList) {
            setTaxesForm(TaxesList);
            setOriginalTaxes(TaxesList);
        }
    }, [TaxesList]);

    const handleUpdateTax = (index, updatedTax) => {
        setTaxesForm((prevTaxes) => {
            const updatedList = prevTaxes.map((tax, i) => (i === index ? updatedTax : tax));
            
            // Compare with original data
            const hasChanges = JSON.stringify(updatedList) !== JSON.stringify(originalTaxes);
            setIsChanged(hasChanges);

            return updatedList;
        });
    };

    const handleDeleteTax = (index) => {
        setTaxesForm((prevTaxes) => {
            const updatedList = prevTaxes.filter((_, i) => i !== index);
            
            const hasChanges = JSON.stringify(updatedList) !== JSON.stringify(originalTaxes);
            setIsChanged(hasChanges);
            
            return updatedList;
        });
    };

    const handleAddNewTax = async () => {
        if (newTax.TaxName && newTax.TaxPercentage) {
            setTaxesForm((prevTaxes) => {
                const updatedList = [...prevTaxes, newTax];

                const hasChanges = JSON.stringify(updatedList) !== JSON.stringify(originalTaxes);
                setIsChanged(hasChanges);
                
                return updatedList;
            });

            setNewTax({ TaxName: "", TaxPercentage: "", Active: 1 });

            if (addMode) {
                await HandleUsers({
                    mode: "insert",
                    item_type: "insert_tax",
                    data: { ...newTax },
                });
            }
        }
        setAddMode(false);
    };

    return (
        <div className="border flex flex-col gap-2 rounded-lg p-8 bg-white w-full max-w-xl ">
            <div className="flex w-full justify-between ">
                <h2 className="text-xl font-semibold">Taxes Manager</h2>
                <button
                    onClick={() => (addMode ? handleAddNewTax() : setAddMode(true))}
                    className={`${addMode ? "bg-green-500" : "bg-orange-400"} p-2 rounded-full text-white`}
                >
                    {addMode ? <MdDone /> : <IoMdAdd />}
                </button>
            </div>

            <div className="grid text-lg font-semibold grid-cols-5">
                {["No.", "Tax Name", "Tax %", "Active", "Action"].map((header, index) => (
                    <span key={index}>{header}</span>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                {taxesForm.map((item, index) => (
                    <TaxRow
                        key={index}
                        tax={item}
                        index={index}
                        onUpdate={handleUpdateTax}
                        onDelete={handleDeleteTax}
                    />
                ))}
            </div>

            {addMode && (
                <div className="grid text-center grid-cols-4 gap-2 border-t pt-2">
                    <span></span>
                    <input
                        type="text"
                        value={newTax.TaxName}
                        onChange={(e) => setNewTax((prev) => ({ ...prev, TaxName: e.target.value }))}
                        placeholder="Tax Name"
                        className="border p-1 rounded"
                    />
                    <input
                        type="number"
                        value={newTax.TaxPercentage}
                        onChange={(e) => setNewTax((prev) => ({ ...prev, TaxPercentage: e.target.value }))}
                        placeholder="Tax %"
                        className="border p-1 rounded"
                    />
                    <select
                        value={newTax.Active}
                        onChange={(e) => setNewTax((prev) => ({ ...prev, Active: Number(e.target.value) }))}
                        className="border p-1 rounded"
                    >
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>
            )}
        </div>
    );
}
