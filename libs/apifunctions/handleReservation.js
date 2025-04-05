import { EmailSender } from "../emailjs/EmailSubmit";
import { HandleCustomer } from "./handleCustomer";


export async function GetReservations(){
    try{
        const reservation_res = await fetch('/api/reservation',{
            method:"GET"
        });
        const reservation_data = await reservation_res.json();
        // const floors = reservation_data.forEach(()=>)
        return reservation_data;
    }
    catch(error){
        console.log(error)
    }
}

export async function HandleTableLayout(item){
    try{
        // console.log(item)
        const table_add_res = await fetch(`/api/reservation/handleReservation`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({insert_data:item})
        })
        let reservation_data;
        if(!table_add_res.ok){
            throw new Error(`Failed to handle item. Status :${table_add_res}`);
        }
       

        const result = await table_add_res.json();
        console.log("Response from server",result);
        return {result,reservation_data}
    }
    catch(error){
        console.log("Error while inserting item: ",error)
    }
}

export async function HandleTableState(item){
    console.log({item})
    try{
        const res = await fetch('/api/reservation/handleReservation',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({insert_data:item})
        })
        // const data = await res.json()  
        const updated_data = await GetReservations()
        return {updated_data};
        // console.log({data})
    }
    catch(error){
        console.log(error)
    }
    return ({item})
}


export async function HandleReservation(item) {
    try {
        let CustomerID = await HandleCustomer({
            ...item,
            mode: "find",
            item_type: "customer",
        });
        // console.log({CustomerID})
        // If customer not found, create a new one and retrieve the ID
        if (!CustomerID) {
            const generatePassword = (phone) => {
                if (!phone || phone.length < 4) {
                    return "TropicalCafe0000"; // Default if phone is invalid
                }
                return `TropicalCafe${phone.slice(-4)}`;
            };


            console.log(item.data)
            
            EmailSender({
                formData:{
                    Email:item.data.CustomerEmail,
                    Password:generatePassword(item.data.CustomerPhone),
                    Name:item.data.CustomerName},
                    subject_purpose:"Login_automated"
                })
            
            await HandleCustomer({
                ...item,
                mode: "insert_from_reservation",
                item_type: "customer",
            });


            

            CustomerID = await HandleCustomer({
                ...item,
                mode: "find",
                item_type: "customer",
            });

          


            if (!CustomerID) {
                throw new Error("Failed to create and retrieve CustomerID.");
            }
        }

        // Proceed with reservation
        const reservation_res = await fetch('/api/reservation/handleReservation', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ insert_data: { ...item, CustomerID } }),
        });


        EmailSender({
            formData:{
                Name:item.data.CustomerName,
                Email:item.data.CustomerEmail,
                ReservationDate:item.data.ReservationDate,
                ReservationTime:item.data.ReservationTime,
                NumberOfGuests:item.data.NumberOfGuests,
            },
            subject_purpose:"Reservation"
            })

        if (!reservation_res.ok) {
            throw new Error(`Failed to handle reservation. Status: ${reservation_res.status}`);
        }

        const result = await reservation_res.json();
        const updated_data = await GetReservations();

        return { updated_data, result };
    } catch (error) {
        console.error("Error handling reservation:", error);
        throw error;
    }
}
