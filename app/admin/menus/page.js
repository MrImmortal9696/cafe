"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSideBar from "../components/AdminSideBar";
import MenuFilters from "../components/menus/MenuFilters";
import MenuList from "../components/menus/MenuList";
import OrdersPagination from "../components/orders/OrdersPagination";
import { GetMenu,InsertInMenu } from "@/libs/apifunctions/handleMenu";
import MenuCategoriesTypesList from "../components/menus/MenuCategoriesTypesList";
import MenuTypesList from "../components/menus/MenuTypesList";
import ConfirmationModal from "../components/ConfirmationModal";
import MenuUpdateForm from "../components/menus/forms/MenuUpdateForm";
import { MenuItemForm,MenuCategoriesForm,MenuTypesForm } from "../components/menus/forms/FormStructures";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionChecker } from "@/libs/sessionChecker";
export default function MenuPage() {
    const [menuOption, setMenuOption] = useState("menu_items");
    const [menuData, setMenuData] = useState(); // Initialize as null or empty
    const [selectedSortOption, setSelectedSortOption] = useState({ name: "", option: "" });
    const [mappedCategories, setMappedCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); // For form modal
    const [itemToDelete, setItemToDelete] = useState({name:"",type:"",dependent_name:"" ,number:"",row:{}});
    const [itemToAdd,setItemToAdd] = useState({name:"",type:"",row:{}})
    const [currentItemForEdit, setCurrentItemForEdit] = useState(null); // Store item to be edited
    const [menuForm, setMenuForm] = useState({formConfig:""});
    const [searchItem,setSearchItem] = useState("")
    const { data:session, status } = useSession()
    const [permission,setPermission] = useState(false)

    useEffect(()=>{
      if(status === "loading" ) return ;

      if(!session || session?.user?.role === "Customer"){
        redirect("/");
        return 
      }

      async function GetSessionCheck(){
          const hasPermission = await SessionChecker(session,"/admin/menus");
          setPermission(hasPermission);
          if(!hasPermission){
            redirect("/")
          }
      }
      GetSessionCheck()

    },[session,status])
    
    useEffect(() => {
      async function fetchData() {
        try {
          const menu_data = await GetMenu();
          setMenuData(menu_data);
          if(menu_data?.menu_categories && menu_data?.menu_types){
              const categoriesWithTypes = menu_data.menu_categories.map((category)=>{
                  const menuTypeName = menu_data.menu_types.find((type)=> type.MenuTypeID === category.MenuTypeID)?.MenuTypeName;
                  const dishes_count = category.dishes_count;
                  return {...category,MenuTypeName:menuTypeName,dishes:dishes_count};
              });
              setMappedCategories(categoriesWithTypes);
          }
        } catch (error) {
          console.error("Error fetching menu data:", error);
        }
      }
      if(session && permission){
        fetchData()
      }
    }, [session,permission]);
    if(status === "loading" || permission === null){
      return (
      <div className="flex justify-center items-center h-screen text-2xl">
          Loading...
      </div>)
    } 
    if(!session || !permission){
      return null
    }

    // const router = useRouter
    function handleDelete(item) {
      // console.log(item)
      setItemToDelete(item);
      setIsModalOpen(true); // Open confirmation modal
    }
  
    async function confirmDelete(item) {
    //   console.log("Deleting item:", item);
      const status = await InsertInMenu(item) === true ? window.location.reload()      : ""
      setIsModalOpen(false);
      setItemToDelete(null); // Reset the selected item
    }
  
    function cancelDelete() {
      setIsModalOpen(false); // Close modal without deleting
      setItemToDelete(null);
    }
  
    async function handleAddItem(item) {
    //   console.log("handle add item",item);
      setCurrentItemForEdit();
      setIsFormModalOpen(true);
      const status = await InsertInMenu(item) === true ? window.location.reload()
      : ""
    }
  
    function handleEdit(item) {
      // console.log("Editing item:", item);
      setCurrentItemForEdit(item); // Set the current item for editing
      setIsFormModalOpen(true); // Open the form modal
    //   console.log(mappedCategories)
    }
  
   // Use an empty dependency array to avoid infinite loops
  
    const functionButtons = [
      
      { title: "Add new items", function: ()=>setIsFormModalOpen(true) },
    ];
  
    const listTypeOptions = [
      { title: "Menu Item", code: "menu_items", function: () => setMenuOption("menu_items") },
      { title: "Categories", code: "menu_categories", function: () => setMenuOption("menu_categories") },
      { title: "Menu Type", code: "menu_type", function: () => setMenuOption("menu_type") },
    ];
  
    const SortOptions = [
      { name: "Menu Categories", options: menuData?.menu_categories },
      { name: "Menu Types", options: menuData?.menu_types },
    ];
  
    // Filter menuItems based on selectedSortOption
    const filteredMenuItems =
      menuData?.menuItems?.filter((item) => {
        if (selectedSortOption.name === "Menu Categories") {
          return menuData?.menu_categories?.some(
            (category) =>
              category.CategoryID === item.CategoryID &&
              category.CategoryName === selectedSortOption.option
          );
        } else if (selectedSortOption.name === "Menu Types") {
          return menuData?.menu_types?.some(
            (type) =>
              type.MenuTypeID ===
                menuData?.menu_categories?.find(
                  (category) => category.CategoryID === item.CategoryID
                )?.MenuTypeID &&
              type.MenuTypeName === selectedSortOption.option
          );
        }
        return true; // Show all items if no filter is applied
      }) || [];
  
    return (
      <div className="relative w-[100vw] h-[100vh] flex bg-red-200">
        <div className="w-[15%] h-full bg-green-200 flex justify-center">
          <AdminSideBar AdminOption={"menus"} />
        </div>
        <div className="w-[85%] h-full flex flex-col items-center gap-2 bg-gray-50">
          <AdminHeader setSearchItem={setSearchItem} searchItem={searchItem} />
          <MenuFilters
            functionButtons={functionButtons}
            listTypeOptions={listTypeOptions}
            currentListOption={menuOption}
            SortOptions={SortOptions}
            setSelectedSortOption={setSelectedSortOption}
            selectedSortOption={selectedSortOption}
            setSearchItem={setSearchItem}
            // handleAddItem={handleAddItem}
            // setItemToAdd={setItemToAdd}
          />
          {menuData ? (
            <>
              {menuOption === "menu_items" && (
                <MenuList
                  menu_types={menuData?.menu_types}
                  menu_categories={menuData?.menu_categories}
                  menuItems={filteredMenuItems} // Pass filtered menuItems
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  selectedSortOption={selectedSortOption}
                  searchItem={searchItem}
                />
              )}
              {menuOption === "menu_categories" && 
              <div className="w-full">
                  <MenuCategoriesTypesList mappedCategories={mappedCategories} 
                  searchItem={searchItem}
                  handleEdit={handleEdit} handleDelete={handleDelete} />
              </div>}
              {menuOption === "menu_type" &&   <div className="w-full">
                  <MenuTypesList types_data={menuData?.menu_types} 
                  searchItem={searchItem}
                  handleEdit={handleEdit} handleDelete={handleDelete} />
              </div>}
            </>
          ) : (
            <div>Loading...</div>
          )}
          {/* <OrdersPagination /> */}
        </div>
        
        {/* Confirmation Modal for deletion */}
        <ConfirmationModal
          isOpen={isModalOpen}
          message={`Are you sure you want to delete ${itemToDelete?.name}? \n 
              ${itemToDelete?.dependent_name ? `There are ${itemToDelete?.number} ${itemToDelete?.dependent_name} linked to this ${itemToDelete.type} table\n
              delete them first`:""}`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          delete_item={itemToDelete}
        />
        
        {/* Dynamic Form Modal for editing */}
        <MenuUpdateForm 
          initialData={currentItemForEdit} 
          isOpen={isFormModalOpen} 
          onClose={() => setIsFormModalOpen(false)} 
          menuOption={menuOption}
          formConfig={
            menuOption === "menu_items" ? MenuItemForm :
            menuOption === "menu_categories" ? MenuCategoriesForm:
            menuOption === "menu_type" ? MenuTypesForm: null} 
          categoryOptions={mappedCategories}
          menuTypeoptions={menuData?.menu_types}
          handleAddItem={handleAddItem}
          setItemToAdd={setItemToAdd}
          setCurrentItemForEdit={setCurrentItemForEdit}
          
        />
      </div>
    );
  }
  