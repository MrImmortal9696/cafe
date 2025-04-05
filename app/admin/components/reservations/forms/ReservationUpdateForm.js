import { HandleTableLayout } from "@/libs/apifunctions/handleReservation";
import { useState, useEffect } from "react";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
export default function ReservationUpdateForm({
  mode,
  initialData,
  isOpen,
  onClose,
  formConfig,
  handleAddItem,
  setCurrentItemForEdit,
  item_type,
  setTablesData,
  newReservationForm
}) {
  const [formData, setFormData] = useState({});

  // Initialize formData with initialData when the modal is opened or data changes
useEffect(() => {
  if (isOpen) {
    const data = {};
    formConfig.forEach(({ field, dropdownOptions }) => {
      data[field] =
        initialData?.[field] ?? (dropdownOptions?.[0]?.value || null); // Use initialData or first dropdown option
    });
    setFormData(data);
  }
}, [isOpen, initialData, formConfig]);


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRemoveOption = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1); // Remove the option at the specified index
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleArrayFieldChange = (field, index, subField, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = {
      ...updatedArray[index],
      [subField]: value, // Update the specific subField (e.g., name or price)
    };
    setFormData({ ...formData, [field]: updatedArray });
  };

  async function handleSubmit (e){
    e.preventDefault();

    // Process the form data and replace empty values with null
    const cleanedFormData = { ...formData };

    // Check if the formData is empty (no meaningful data)
    let isFormEmpty = true;

    for (let field in cleanedFormData) {
      if (Array.isArray(cleanedFormData[field])) {
        // If the array has only one item and that item is empty, set the array to null
        if (cleanedFormData[field].length === 1 && Object.keys(cleanedFormData[field][0]).length === 0) {
          cleanedFormData[field] = null;
        } else {
          // Handle array elements and set empty subfields to null
          cleanedFormData[field] = cleanedFormData[field].map((item) => {
            for (let subField in item) {
              if (item[subField] !== "" && item[subField] !== undefined && item[subField] !== null) {
                isFormEmpty = false; // Data is present
              }
              if (item[subField] === "" || item[subField] === undefined || item[subField] === null) {
                item[subField] = null;
              }
            }
            return item;
          });
        }
      } else if (cleanedFormData[field] !== "" && cleanedFormData[field] !== undefined && cleanedFormData[field] !== null) {
        isFormEmpty = false; // Data is present
      } else {
        cleanedFormData[field] = null; // Set empty or undefined values to null
      }
    }

    if (isFormEmpty) {
      alert("Please fill in the form before submitting.");
      return;
    }
    console.log("data",cleanedFormData)
    // Clear the form by resetting formData to an empty object
    setFormData({});
    // console.log(mode)
    await HandleTableLayout({mode,item_type,data:cleanedFormData})
     const res = await HandleUsers({
                mode: "get",
                item_type: "reservedTables",
                data: {
                  ReservationDate: newReservationForm?.ReservationDate,
                  ReservationTime: newReservationForm?.ReservationTime,
                },
              });
            setTablesData(res) 
    onClose(); 
    };

  const handleClose=()=>{
    // setCurrentItemForEdit()
    setFormData({})
    onClose()
  }

  if (!isOpen) return null; // Don't render the form if the modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[600px]">
        <h2 className="text-xl font-bold mb-4">Edit Reservation Tables</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-scroll max-h-[80vh] no-scrollbar">
          {formConfig.map(({ title, field, type, dropdownOptions, min, max, step, arrayFields,readOnly,placeholder,required }, index) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="text-md font-semibold text-gray-900">{title}</label>
                {type === "select" ? (
                  <select
                    value={formData[field] || initialData[field]}
                    required={required}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`${title} - Select option`} // Adding aria-label for accessibility
                  >
                    <option value={""}>{`Select ${title}`}</option>
                    {dropdownOptions?.map((option, optionIndex) => (
                      <option key={optionIndex } value={option.value }>
                        {option.label || option.value } {/* Display value or label */}
                      </option>
                    ))}
                  </select>
                ) : type === "textarea" ? (
                  <textarea
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder={placeholder}
                  />
                ) : type === "array" ? (
                  <div className="flex flex-col gap-2">
                    {(formData[field] || []).map((item, arrayIndex) => (
                      <div key={arrayIndex} className="flex justify-between items-center gap-4 p-2 border-b">
                        {arrayFields?.map(({ title, field: subField, type }) => (
                          <div key={subField} className="flex items-center gap-2">
                            <input
                              type={type || "text"}
                              value={item[subField] || ""}
                              onChange={(e) => handleArrayFieldChange(field, arrayIndex, subField, e.target.value)}
                              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`${title}`}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(field, arrayIndex)}
                          className="px-3  text-xl font-bold bg-red-400 text-white rounded hover:bg-red-500"
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          [field]: [...(formData[field] || []), {}],
                        })
                      }
                      className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Add {title}
                    </button>
                  </div>
                ) : type === "slider" ? (
                  <div className="flex justify-center">
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={formData[field] || 0}
                      onChange={(e) => handleChange(field, parseInt(e.target.value))}
                      className="w-[50%] mx-auto"
                      
                    />
                    <div className="text-md  text-gray-500">Value:<span className="font-bold text-xl">{formData[field]}</span></div>
                  </div>
                ) : type === "password" ? (
                  <input
                    type="password"
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required={required}
                  />
                ) : (
                  <input
                    type={type || "text"}
                    value={formData[field] || ""}
                    readOnly={readOnly ? true : false}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(field, e.target.value)}
                    
                    required={required}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
          ))}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleClose} // Close the modal on cancel
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
