import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useState,useEffect } from "react";
import { MdDone, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function RoleManagerCard({ role, paths,setPathsData,setRolesData,setPermissionsData }) {
  const [editMode, setEditMode] = useState(false);
  const [updatedRole, setUpdatedRole] = useState(role);
  const [selectedPaths, setSelectedPaths] = useState(
    updatedRole.paths.map((path) => ({
      pathID: path.pathId,
      pathName: path.pathName,
      name: path.name,
      can_access: path.can_access, // Initialize can_access value
      mutable: path.mutable, // Include the mutable flag for each path
    }))
  );
  useEffect(() => {
    // console.log("Updated rolesAccessData in Card:", role);
    setUpdatedRole(role)
  }, [role]);
  

  // Function to check if the path is selected based on pathID
  const isPathSelected = (path) =>
    selectedPaths.some((selected) => selected.pathID === path.pathID && selected.can_access === 1);

  // Function to toggle the selection of a path and update can_access
  const togglePathSelection = (path) => {
    if (path.mutable === 0) return; // Prevent selection/deselection if mutable is 0
    
    setSelectedPaths((prev) =>
      prev.map((selected) =>
        selected.pathID === path.pathID
          ? {
              ...selected,
              can_access: selected.can_access === 1 ? 0 : 1, // Toggle can_access between 1 and 0
            }
          : selected
      )
    );
  };

  async function handleDelete() {
    const isConfirmed = window.confirm(`Are you sure you want to delete role : ${updatedRole.roleName}?`);
    
    if (isConfirmed) {
      // console.log("Deleting id:", role.roleID);
      await HandleUsers({
        mode: "delete",
        item_type: "roles",
        data: { roleID:updatedRole.roleID},
      });
      const roles_res = await HandleUsers({mode:"get",item_type:"roles",data:{Email:null}})
      const paths_res = await HandleUsers({mode:"get",item_type:"paths",data:{Email:null}})
      const permission_res = await HandleUsers({mode:"get",item_type:"permissions",data:{Email:null}})
  
      setPathsData(paths_res)
      setRolesData(roles_res)
      setPermissionsData(permission_res)
      // window.location.reload()
      // Proceed with deletion logic here
    } 
  }
  

  // Function to handle saving changes when editing permissions
  async function handlePermissionEditing() {
    
    setEditMode(false);
    // Prepare data for the database
    // console.log({ updatedRole, selectedPaths });

    // Example of calling the HandleUsers function to update permissions
    await HandleUsers({
      mode: "update",
      item_type: "permission_access",
      data: { selectedPaths, roleID: role.roleID },
    });
    const roles_res = await HandleUsers({mode:"get",item_type:"roles",data:{Email:null}})
    const paths_res = await HandleUsers({mode:"get",item_type:"paths",data:{Email:null}})
    const permission_res = await HandleUsers({mode:"get",item_type:"permissions",data:{Email:null}})

    setPathsData(paths_res)
    setRolesData(roles_res)
    setPermissionsData(permission_res)

  }

  return (
    <div className="p-2 border border-zinc-300 rounded-lg flex flex-col justify-between gap-4 hover:bg-orange-50">
      <div className="flex flex-col gap-4">
      <div className="text-xl font-bold flex justify-between items-center">
        <span> {updatedRole.roleName}</span>
       { updatedRole.roleName !== "admin" &&
        <button onClick={() => { editMode ? handlePermissionEditing() : setEditMode(true) }}>
          {!editMode  ? (
            <span className="bg-orange-300 flex p-2 text-2xl rounded-full w-full">
              <MdEdit />
            </span>
          ) : (
            <span className="bg-green-400 text-white flex p-2 text-2xl rounded-full w-full">
              <MdDone />
            </span>
          )}
        </button>}
      </div>

      {!editMode ? (
        <div className="flex flex-col gap-2">
          {updatedRole.paths.map((path, index) => (
            <div
              key={index}
              className={`${
                path.mutable === 0 ? "opacity-50 bg-gray-300" : "" // Disable and highlight immutable paths
              } ${path.can_access === 1 ? "visible" : "hidden"} bg-orange-200 bg-opacity-60 text-md p-2 rounded-lg`}
            >
              {path.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {paths.map((path, index) => (
            <div
              key={index}
              className={`${
                path.mutable === 0
                  ? "bg-gray-300 opacity-50" // Highlight and disable immutable paths
                  : isPathSelected(path)
                  ? "bg-green-200"
                  : "bg-zinc-100"
              } text-md p-2 cursor-pointer rounded-lg`}
              onClick={() => {
                if (path.mutable === 0) return; // Prevent selection/deselection if mutable is 0

                // Check if path is already selected, then toggle
                if (isPathSelected(path)) {
                  // If selected, set can_access to 0 and keep it in the list
                  setSelectedPaths((prev) =>
                    prev.map((selected) =>
                      selected.pathID === path.pathID
                        ? { ...selected, can_access: 0 } // Deselect path by setting can_access to 0
                        : selected
                    )
                  );
                } else {
                  // If not selected, set can_access to 1 and add to the list
                  setSelectedPaths((prev) => [
                    ...prev,
                    { pathID: path.pathID, pathName: path.pathName, name: path.name, can_access: 1 },
                  ]);
                }
              }} // Toggle selection on click
            >
              {path.name}
            </div>
          ))}
        </div>
      )}
      </div>
    {updatedRole.roleName !== "admin" &&
      <div className="w-full flex justify-end text-end text-2xl ">
        
          <button 
          onClick={()=>handleDelete()}
          className="bg-red-100 rounded-full p-2 text-red-500">
              <MdDelete/>
          </button>

      </div>}
    </div>
  );
}