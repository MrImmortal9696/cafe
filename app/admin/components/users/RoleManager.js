import { useState,useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDone, MdEdit } from "react-icons/md";
import RoleManagerCard from "./RoleManagerCard";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";

export default function RoleManager({ 
  roles, 
  permissions, 
  paths,
  setPermissionsData,
  setPathsData,
  setRolesData,
  rolesAccessData,
  getRoleWiseAccessPaths,
  setRolesAccessData,
  
 }) {
  const [selectedPermissions, setSelectedPermissions] = useState(
    roles.reduce((acc, role) => {
      acc[role.id] = permissions
        .filter((permission) => permission.role_id === role.id && permission.can_access === 1)
        .map((permission) => permission.path_id);
      return acc;
    }, {})
  );

  const [newSelections, setNewSelections] = useState({});
  const [removedSelections, setRemovedSelections] = useState({});
  const [newRole, setNewRole] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [editedRoleName, setEditedRoleName] = useState({});

  // useEffect(() => {
    // console.log("Updated rolesAccessData in RoleManager:", rolesAccessData);
  // }, [rolesAccessData]);
  

  // Handle selecting/unselecting a permission
  const handlePermissionSelect = (roleId, pathId) => {
    const isMutable = permissions.some(
      (perm) => perm.role_id === roleId && perm.path_id === pathId && perm.mutable
    );

    if (!isMutable && selectedPermissions[roleId]?.includes(pathId)) return;

    setSelectedPermissions((prev) => {
      const updatedPermissions = prev[roleId]?.includes(pathId)
        ? prev[roleId].filter((id) => id !== pathId)
        : [...(prev[roleId] || []), pathId];

      return { ...prev, [roleId]: updatedPermissions };
    });

    // Track newly added/removed selections
    if (selectedPermissions[roleId]?.includes(pathId)) {
      setRemovedSelections((prev) => ({
        ...prev,
        [roleId]: [...(prev[roleId] || []), pathId],
      }));
    } else {
      setNewSelections((prev) => ({
        ...prev,
        [roleId]: [...(prev[roleId] || []), pathId],
      }));
    }
  };

  // Handle role name change
  const handleRoleNameChange = (roleId, value) => {
    setEditedRoleName((prev) => ({
      ...prev,
      [roleId]: value,
    }));
  };

  async function HandleAddRole(){
    setAddMode(false)
    setNewRole("")
    if(newRole.length > 2){
      await HandleUsers({mode:"insert",item_type:"roles",data:{name:newRole}})
      const roles_res = await HandleUsers({mode:"get",item_type:"roles",data:{Email:null}})
      setRolesData(roles_res)
    }
  }


  return (
    <div className="w-full p-4 flex-center flex-col pb-[10%]">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Assign Permissions to Roles
      </h2>
      {/* <pre>{JSON.stringify(rolesAccessData,null,2)}</pre> */}
    
        <div className="grid grid-cols-4 p-4 gap-2 w-full">
            {rolesAccessData?.map((role,index)=>(
                <RoleManagerCard 
                role={role} 
                paths={paths} 
                key={index} 
                setPermissionsData={setPermissionsData} 
                setPathsData={setPathsData} 
                setRolesData={setRolesData} />
            ))}
      </div>

      

      <div className="justify-between w-[50%] mx-auto flex gap-4 bg-zinc-200 rounded-xl mt-4 items-center p-4">
        <label className="text-xl font-semibold">Add new Role</label>
        {addMode && (
          <input
            className="p-2 rounded-lg bg-zinc-100 w-full border-2 border-zinc-400"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
        )}

        <button onClick={() => addMode ? HandleAddRole():setAddMode(true)}>
          {!addMode ? (
            <span className="bg-orange-400 flex p-2 text-2xl rounded-full w-full">
              <IoMdAdd />
            </span>
          ) : (
            <span className="bg-green-400 text-white flex p-2 text-2xl rounded-full w-full">
              <MdDone />
            </span>
          )}
        </button>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-xl font-semibold">Generated Queries:</h3>
        <pre className="p-4 border rounded bg-gray-100 text-sm">
          {JSON.stringify(generateQueries(), null, 2)}
        </pre>
      </div> */}
    </div>
  );
}