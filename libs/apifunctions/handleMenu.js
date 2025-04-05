export async function GetMenu() {
    try {
      const menu_res = await fetch("/api/menu", {
        method: "GET",
      });
      if (!menu_res.ok) {
        throw new Error("Failed to fetch menu");
      }
      const menu_Data = await menu_res.json();
  
      return menu_Data
  
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }

  export async function InsertInMenu(item) {
    try {
      const menu_add_res = await fetch(`/api/menu/handleMenu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ insert_data: item }), // Ensure proper formatting
      });
      console.log({item})
  
      if (!menu_add_res.ok) {
        throw new Error(`Failed to insert item. Status: ${menu_add_res.status}`);
      }
  
      const result = await menu_add_res.json();
      console.log("Response from server:", result);
      return result.status
    } catch (error) {
      console.error("Error while inserting item:", error);
    }
  }
  