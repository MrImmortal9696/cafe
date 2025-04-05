import { NextResponse } from "next/server";
import { connect_mysql } from "@/libs/mysql";

export async function GET(req){
    try{
        const [reservedTables] = await connect_mysql.query("SELECT * FROM ReservedTables")
        const [tables] = await connect_mysql.query("SELECT * FROM Tables")
        const [reservations] = await connect_mysql.query(`
SELECT
    r.ReservationID,
    r.CustomerID,
    DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') AS ReservationDate,
    r.ReservationTime,
    r.NumberOfGuests,
    r.TableID_list,
    r.Reservation_type,
    r.Reservation_Status,
    r.CreatedAt,
    c.CustomerName,
    c.CustomerEmail,
    r.Preferences,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'name', t.TableName,
            'floor', t.Floor_Value
        )
    ) AS TableNames
FROM Reservations r
JOIN Customers c ON r.CustomerID = c.CustomerID
JOIN (
    SELECT DISTINCT t.TableID, t.TableName, t.Floor_Value
    FROM Tables t
    LEFT JOIN ReservedTables rt ON t.TableID = rt.TableID
) t ON JSON_CONTAINS(r.TableID_list, CAST(t.TableID AS JSON))
GROUP BY 
    r.ReservationID,
    r.CustomerID,
    ReservationDate,
    r.ReservationTime,
    r.NumberOfGuests,
    r.TableID_list,
    r.Reservation_type,
    r.Reservation_Status,
    r.CreatedAt,
    c.CustomerName,
    c.CustomerEmail,
    r.Preferences
;


`);
        
        
        // console.log()
                  
        return NextResponse.json({reservations,reservedTables,tables})
    }
    catch(error){
        console.log(error)
        return NextResponse.json({status:500,message:error})
    }
}

