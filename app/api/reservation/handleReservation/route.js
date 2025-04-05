import { connect_mysql } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { ReservationQueryHandling, TableQueryHandling } from "@/libs/apifunctions/reservation_queries";
import { CustomerQueryHandling } from "@/libs/apifunctions/customer_queries";
import { CartOrderHandling } from "@/libs/apifunctions/order_queries";

export async function POST(req) {
    let connection;  // Define connection variable

    try {
        const { insert_data } = await req.json();

        // console.log("Insert Data Received:", insert_data);

        const { data, mode, item_type } = insert_data;
        console.log({mode, item_type})
        // Identify the appropriate query handler
        const queryHandler =
            TableQueryHandling.find(
                (handler) => handler.mode === mode && handler.item_type === item_type) ||
            ReservationQueryHandling.find(
                (handler) => handler.mode === mode && handler.item_type === item_type) ||
            CartOrderHandling.find(
                (handler) => handler.mode === mode && handler.item_type === item_type) ||    
            CustomerQueryHandling.find(
                (handler) => handler.mode === mode && handler.item_type === item_type);

        if (!queryHandler) {
            throw new Error(`No matching query handler found for mode: ${mode}, item_type: ${item_type}`);
        }
    
        if (!queryHandler || typeof queryHandler.query !== "function" || typeof queryHandler.values !== "function") {
            throw new Error("Unsupported query or handler configuration");
        }

        let sqlQuery, values;

        if (mode === "auto-update" && Array.isArray(data)) {
            // Special handling for "auto-update" mode when `data` is an array
            sqlQuery = queryHandler.query(data); // Pass the array to the query generator
            values = queryHandler.values(data); // Pass the array to the values generator
        } else {
            // Default handling for other modes
            sqlQuery = queryHandler.query(data);
            values = queryHandler.values(data);
        }

        console.log("Generated SQL Query:", sqlQuery);
        console.log("Generated Values:", values);

        // Get connection from pool
        connection = await connect_mysql.getConnection();

        // Execute the query with the generated SQL and values
        const [res] = await connection.execute(sqlQuery, values);

        console.log("Database Operation Successful");
        return NextResponse.json({ status: 200, message: "Operation Successful", res });
    } catch (error) {
        console.error("Error Handling Request:", error);
        return NextResponse.json({ status: 500, error: error.message });
    } finally {
        if (connection) connection.release();  // Ensure connection is released back to the pool
    }
}
