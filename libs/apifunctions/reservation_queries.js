export const TableQueryHandling = [
    {
        mode: "insert",
        item_type: "table",
        table_name: "Tables",
        query: (data) => `
        INSERT INTO Tables (TableName, Floor_Value)
        VALUES (?, ?)`,
        values: (data) => [
            data.TableName,
            data.Floor_Value
        ]
    },
    {
        mode: "status-update",
        item_type: "reservations",
        table_name: "Reservations",
        query: (data) => `
            UPDATE Reservations
            SET Reservation_Status = ?
            where ReservationID = ?
        `,
        values: (data) => [
            data.Reservation_Status,
            data.ReservationID,
        ],
    },
    {
        mode: "update",
        item_type: "table",
        table_name: "Tables",
        query: (data) => `
        UPDATE Tables 
        SET
            TableName = ?,
            Floor_Value = ?
        WHERE TableID = ?`,
        values: (data) => [
            data.TableName,
            data.Floor_Value,
            data.TableID
        ]
    },
    {
        mode: "delete",
        item_type: "table",
        table_name: "Tables",
        query: (data) => `
        DELETE FROM Tables 
        where TableID = ?`,
        values: (data) => [
            data.TableID
        ]
    },
    {
        mode: "auto-update",
        item_type: "table",
        table_name: "Tables",
        query: (data) => `
        UPDATE Tables
        SET
            ChairSize = CASE TableID 
                ${data.map(() => `WHEN ? THEN ?`).join(" ")}
            END,
            ChairOrientation = CASE TableID
                ${data.map(() => `WHEN ? THEN ?`).join(" ")}
            END,
            X_Coordinate = CASE TableID
                ${data.map(() => `WHEN ? THEN ?`).join(" ")}
            END,
            Y_Coordinate = CASE TableID
                ${data.map(() => `WHEN ? THEN ?`).join(" ")}
            END
        WHERE TableID IN (${data.map(() => "?").join(", ")})`,
        values: (data) => {
            const values = [];
            
            // Add values for ChairSize
            data.forEach((table) => {
                values.push(table.TableID, table.ChairSize);
            });
            
            // Add values for ChairOrientation
            data.forEach((table) => {
                values.push(table.TableID, table.ChairOrientation);
            });
            
            // Add values for X_Coordinate
            data.forEach((table) => {
                values.push(table.TableID, table.X_Coordinate);
            });
            
            // Add values for Y_Coordinate
            data.forEach((table) => {
                values.push(table.TableID, table.Y_Coordinate);
            });
            
            // Add TableID values for WHERE IN clause
            data.forEach((table) => {
                values.push(table.TableID);
            });

            return values;
        }
    }
];


export const ReservationQueryHandling = [
    {
        mode: "status-update",
        item_type: "reservations",
        table_name: "Reservations",
        query: (data) => `
            UPDATE Reservations
            SET Reservation_Status = ?
            WHERE ReservationID = ?
        `,
        values: (data) => [
            data.Reservation_Status, // For Reservations table
            data.ReservationID, // For Reservations table
        ],
    },
    {
      mode: "insert",
      item_type: "Reservations",
      query: (data) => {
        return `
          INSERT INTO Reservations (
            CustomerID,
            ReservationDate,
            ReservationTime,
            NumberOfGuests,
            TableID_list,
            Reservation_type,
            Preferences
          )
          VALUES (
            (SELECT CustomerID FROM Customers WHERE CustomerEmail = ?), 
            ?, ?, ?, ?, ? , ?
          );
        `;
      },
      values: (data) => [
        data.CustomerEmail,        // To find the CustomerID
        data.ReservationDate,      // ReservationDate
        data.ReservationTime,      // ReservationTime
        data.NumberOfGuests,       // NumberOfGuests
        data.TableID_list, 
        data.Reservation_type,
        data.Preferences || null
      ],
    },
    
  ];
  