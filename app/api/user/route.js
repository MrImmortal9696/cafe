import { connect_mysql } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { UserQueryHandling } from "@/libs/apifunctions/user_queries";

export async function POST(req) {
  let connection; // Define connection variable

  try {
    const { insert_data } = await req.json();
    const { data, mode, item_type } = insert_data;
    console.log({insert_data})
    // Exclude the `password` field
    const filteredData = { ...data };

    // Find the appropriate query handler
    const queryHandler = UserQueryHandling.find(
      (handler) => handler.mode === mode && handler.item_type === item_type
    );

    if (!queryHandler || typeof queryHandler.query !== "function" || typeof queryHandler.values !== "function") {
      throw new Error("Unsupported mode, item_type, or invalid query handler configuration.");
    }

    // Generate the query and values
    const sqlQuery = queryHandler.query(filteredData);
    const values = queryHandler.values(filteredData);

    console.log("Executing Query:", sqlQuery);
    console.log("With Values:", values);

    // Get connection from pool
    connection = await connect_mysql.getConnection();
    if (!connection) throw new Error("Failed to obtain database connection.");

    // Execute the query
    const [result] = await connection.execute(sqlQuery, values);

    return NextResponse.json({ status: true, insert_data, result });

  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release(); // Ensure connection is released
    }
  }
}
