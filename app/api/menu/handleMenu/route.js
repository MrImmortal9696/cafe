import { connect_mysql } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { InsertQueryHandling, DeleteQueryHandling, UpdateQueryHandling } from "@/libs/apifunctions/menu_queries";

export async function POST(req) {
  let connection; // Define connection variable
  try {
    const { insert_data } = await req.json();
    const { data, mode, item_type } = insert_data;

    // Exclude the `password` field from data
    const { password, ...filteredData } = data;

    // Find the appropriate query handler
    const queryHandler = (
      InsertQueryHandling.find((handler) => handler.mode === mode && handler.item_type === item_type) || 
      UpdateQueryHandling.find((handler) => handler.mode === mode && handler.item_type === item_type) ||
      DeleteQueryHandling.find((handler) => handler.mode === mode && handler.item_type === item_type) 
    );

    if (!queryHandler || typeof queryHandler.query !== "function" || typeof queryHandler.values !== "function") {
      throw new Error("Unsupported mode, item_type, or invalid query handler configuration.");
    }

    // Generate the query and values
    const sqlQuery = queryHandler.query(filteredData);
    const values = queryHandler.values(filteredData);
    console.log(insert_data)
    console.log(sqlQuery);
    console.log(values);

    // Get connection from pool
    connection = await connect_mysql.getConnection();

    // Execute the query
    await connection.execute(sqlQuery, values);

    return NextResponse.json({ status: true, insert_data });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release(); // Ensure the connection is released back to the pool
  }
}
