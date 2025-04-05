export async function HandleCustomer(item) {
    try {
      const reservation_res = await fetch('/api/customer', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insert_data: item }),
      });
      // console.log({item})
      const result = await reservation_res.json();
      const CustomerID = result?.result?.[0]?.CustomerID || null;
      
      

  
      return CustomerID;
    } catch (error) {
      console.error("Error handling customer:", error);
  
      // Return null or throw an error based on your needs
      return null;
    }
  }
  