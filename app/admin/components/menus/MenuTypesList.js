import { FaFileDownload } from "react-icons/fa";
import { convertJsonToCsv } from "@/libs/jsonTocsv";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

export default function MenuTypesList({ types_data, handleEdit, handleDelete, searchItem }) {
  const typesHeaders = ["Index", "Menu Type", "Categories count"];

  const handleDeleteBody = (row) => {
    const delete_body = {
      mode:"delete",
      item_type:"menu_type",
      data:{
      MenuTypeID:row.MenuTypeID,
      name: row.MenuTypeName,
      type: "Menu Type",
      dependent_name: "menu categories",
      number: row.categories_count,
      table_name: "MenuTypes",
      row}
    };
    handleDelete(delete_body);
    return;
  };

  const handleExport = () => {
    convertJsonToCsv(types_data, "menu_types.csv");
    return;
  };

  // Filter types_data based on searchItem
  const filteredTypes = types_data.filter((row) => {
    if (!searchItem) return true; // If no searchItem, don't filter
    const searchTerm = searchItem.toLowerCase();
    return (
      (row.MenuTypeName && row.MenuTypeName.toLowerCase().includes(searchTerm)) ||
      (row.MenuTypeID && row.MenuTypeID.toString().includes(searchTerm))
    );
  });

  return (
    <div className="p-4 relative bg-white w-[95%] mx-auto h-[calc(100vh-300px)] overflow-y-scroll no-scrollbarkz rounded-lg">
      <div className="text-[24px] my-2 w-full flex justify-end">
        <button onClick={handleExport} className="flex items-center ">
          <span className="text-[16px] font-semibold">Export </span>
          <FaFileDownload />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 text-gray-800 text-lg font-bold text-center">
        {/* Headers */}
        {typesHeaders.map((header, index) => (
          <div key={index} className="col-span-2">
            {header}
          </div>
        ))}
        <div className="col-start-10 col-span-2">Actions</div>
      </div>

      <div className="flex mt-4 flex-col gap-2">
        {/* Rows */}
        {filteredTypes.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-12 gap-4 text-lg py-2 text-center">
            <div className="col-span-2 font-semibold">{row.MenuTypeID}</div>
            <div className="col-span-2 font-semibold">{row.MenuTypeName}</div>
            <div className="col-span-2">{row.categories_count}</div>

            <div className="col-start-10 col-span-2 text-2xl gap-6">
              <button
                className="hover:bg-orange-300 hover:text-white p-2 rounded-lg"
                onClick={() => {
                  handleEdit(row);
                }}
              >
                <FiEdit />
              </button>
              <button
                className="hover:bg-red-300 text-red-400 hover:text-white p-2 rounded-lg"
                onClick={() => {
                  handleDeleteBody(row);
                }}>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
