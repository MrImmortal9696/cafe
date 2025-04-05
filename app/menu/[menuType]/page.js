"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Import useParams
import Header from "@/app/components/landing/Header";
import HeroSection from "@/app/components/landing/HeroSection";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import WineGlass from "@/app/components/elements/wineglass";
import SocialsIcons from "@/app/components/elements/socialsIcons";
import Footer from "@/app/components/landing/Footer";
import MenuSection from "@/app/components/landing/MenuSection";

export default function MenuTypesPage() {
  const { menuType } = useParams(); // ✅ Extract menuType from params
  const [showMore, setShowMore] = useState(false);
  const [menuData, setMenuData] = useState([]); // Expect raw menu data
  const [MenutypeList,setMenuTypeList] = useState([])


  
  useEffect(() => {
    async function GetMenuTypeData() {
      try {
        const res = await HandleUsers({
          mode: "get",
          item_type: "typewise_menu",
          data: { MenuType: menuType }, 
        });

        
        // console.log({res})
        setMenuData(res[0])
      } catch (error) {
        console.error("Error fetching menu type data:", error);
      }
    }
    GetMenuTypeData();
  }, [menuType]); 

  useEffect(()=>{
    async function GetMenuTypesList(){
      const res = await HandleUsers({mode:"get",item_type:"menuTypes",data:{}})
      setMenuTypeList(res)
      // console.log({res})
    }
    GetMenuTypesList()

  },[])

  return (
    <div className="relative overflow-x-hidden bg-black">
      <div className="fixed z-10 w-full top-0">
        <Header currentSection="Menu" />
      </div>
      <div className="flex flex-shrink-0 h-full flex-col items-center">
        <HeroSection
          imagelink="https://i.pinimg.com/736x/f4/37/8b/f4378b53ce36da19e06d0f59941a3c63.jpg"
          blur={0}
          height={50}
          top="Our Menu"
          heading="Serving our best"
          description="Explore our authentic Caribbean flavors, crafted with bold spices and vibrant traditions."
          nav={[
            { name: "HOME", link: "/" },
            { name: "MENU", link: "/menu" },
          ]}
        />
        <div className="w-[95%] h-auto relative rounded-[20px] container-shadow-top pb-[10vh] bg-white">
          <div className="absolute w-full flex-center top-[-40px]">
            <WineGlass />
          </div>
          <div className="w-full mx-auto px-6 flex-col-center gap-8 mt-12">
            <div className="bg-[#F59D12] bg-opacity-30 px-4 py-2 rounded-xl">
              <SocialsIcons />
            </div>
            <div className="w-full flex-center">
              <MenuSection menuData={menuData} />
              {/* <pre>
                {JSON.stringify(MenutypeList,null,2)}
              </pre> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
