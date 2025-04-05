"use client"

import { useEffect,useState } from "react"
import AdminHeader from "../components/AdminHeader"
import AdminSideBar from "../components/AdminSideBar"
import { HandleUsers } from "@/libs/apifunctions/handleUsers"
import { useSession } from "next-auth/react"
import UsersListItem from "../components/users/UsersListItems"
import NewUserForm from "../components/users/NewUserForm"
import { getRoleWiseAccessPaths } from "@/libs/getRoleWiseAccessPaths"
import { SessionChecker } from "@/libs/sessionChecker"
import RoleManager from "../components/users/RoleManager"
import { redirect } from "next/navigation"
export default function UsersPage(){
  const [usersData,setUsersData] = useState([])
  const [rolesData,setRolesData] = useState([])
  const [pathsData,setPathsData] = useState([])
  const [permissionsData,setPermissionsData] = useState([])
  const [showSection,setShowSection] = useState("userList")
  const {data:session,status} = useSession()
  const [permission,setPermission] = useState(false)
  const [rolesAccessData, setRolesAccessData] = useState([])



  useEffect(()=>{
      if(status === "loading") return ;
  
      if(!session || session?.user?.role === "Customer"){
        redirect("/")
        return ;
      }
      async function GetSessionCheck(){
        const hasPermission = await SessionChecker(session,"/admin/users")
        setPermission(hasPermission)
        if(!hasPermission){
          redirect("/")
        }
      }
      GetSessionCheck()
    },[session,status])

  useEffect(()=>{
    async function GetUsersData(){
      const users_res = await HandleUsers({mode:"get",item_type:"users",data:{Email:session?.user?.email}})
      const roles_res = await HandleUsers({mode:"get",item_type:"roles",data:{Email:session?.user?.email}})
      const paths_res = await HandleUsers({mode:"get",item_type:"paths",data:{Email:session?.user?.email}})
      const permission_res = await HandleUsers({mode:"get",item_type:"permissions",data:{Email:session?.user?.email}})

      setUsersData(users_res)
      setPathsData(paths_res)
      setRolesData(roles_res)
      setPermissionsData(permission_res)
      // console.log(users_res)
    }
    if(session && permission){
      GetUsersData()
    }
  },[session,permission])


  useEffect(()=>{
    {
    if(rolesData && permissionsData && pathsData)
      {
        // console.log(rolesAccessData)
        setRolesAccessData(getRoleWiseAccessPaths(rolesData,permissionsData,pathsData))
      }
    }
  },[rolesData,permissionsData,pathsData])

  if (status === "loading" || permission === null) {
    return (
        <div className="flex justify-center items-center h-screen text-2xl">
            Loading...
        </div>
    );
}
if(!session || !permission){
  return null
}



    

  const UserListHeaders = ["User ID","User Name","Email","Password","Role","Actions"]
  const SectionOptions = [
    {title:"Users",option:"userList"},
    {title:"New User",option:"newUser"},
    {title:"Manage Roles",option:"manageRoles"}]
    return (
      <div className="relative w-[100vw] h-[100vh] flex ">
            <div className="w-[15%] h-full flex justify-center">
              <AdminSideBar AdminOption={"users"} />
            </div>
            <div className="w-[85%] h-full flex flex-col gap-2 ">
              <AdminHeader />
              <div className="font-bold text-lg p-2 flex w-[95%] mx-auto gap-4 ">
                  {SectionOptions.map((section,index)=>(
                    <button
                    key={index} 
                    onClick={()=>{setShowSection(section.option)}}
                    className={`pb-2 px-4 ${section.option === showSection ? "border-b-2  border-orange-400 text-orange-400":"text-zinc-600 "}`}>
                      {section.title}
                    </button>
                  ))}
              </div> 
              <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll 
                              no-scrollbar bg-zinc-50 flex flex-col">
                {/* <pre>{JSON.stringify(rolesData,null,2)}</pre> */}
                
                                                                            {/* Headers */}
                  {showSection === "userList" &&
                    <div>
                    <div className="grid grid-cols-6 text-lg font-semibold text-center">
                        {UserListHeaders.map((header,index)=>(
                        <span key={index} >{header}</span>
                      ))}
                    </div>
                    <div>
                      {/* <pre>{JSON.stringify(usersData,null,2)}</pre> */}
                      {usersData.map((user,index)=>(
                        <UsersListItem user={user} setUsersData={setUsersData} key={index} rolesData={rolesData} />
                      ))} 
                    </div>
                  </div>
                  }

                  {showSection === "newUser" &&
                    <div>
                      <NewUserForm roles={rolesData} setUsersData={setUsersData}/>
                    </div>
                  }

                  {showSection === "manageRoles" &&
                    <div className="">
                      <RoleManager 
                      roles={rolesData} 
                      setPermissionsData={setPermissionsData}
                      setPathsData={setPathsData} 
                      setRolesData={setRolesData}
                      permissions={permissionsData} 
                      paths={pathsData}
                      rolesAccessData={rolesAccessData} 
                      getRoleWiseAccessPaths={getRoleWiseAccessPaths}
                      setRolesAccessData={setRolesAccessData}
                      />
                    </div>
                  }
              </div>
            </div>  
      </div>
  )
}
