export async function GetOrders(){
  try {
      const reservation_res = await fetch('/api/orders', {
        method: "GET",
      });
  
      const result = await reservation_res.json();
      return {...result}
  
      
    } catch (error) {
      console.error("Error handling customer:", error);
  
      // Return null or throw an error based on your needs
      return null;
    }
}


export async function MakeOrder(item){
    try {
        const reservation_res = await fetch('/api/reservation/handleReservation', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ insert_data: item }),
        });
    
        const result = await reservation_res.json();
    
      } catch (error) {
        console.error("Error handling customer:", error);
    
        // Return null or throw an error based on your needs
        return null;
      }
}

// export async function HandleCustomer(item) {
//     try {
//       const reservation_res = await fetch('/api/reservation/handleReservation', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ insert_data: item }),
//       });
  
//       const result = await reservation_res.json();
  
//       // Safely access the result and extract CustomerID
//       const CustomerID = result?.res?.[0]?.[0]?.CustomerID || null;
  
//       // console.log("CustomerID:", CustomerID);
//       // console.log("Result:", result);
  
//       return CustomerID;
//     } catch (error) {
//       console.error("Error handling customer:", error);
  
//       // Return null or throw an error based on your needs
//       return null;
//     }
//   }
  