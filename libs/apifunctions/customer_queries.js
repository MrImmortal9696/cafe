export const CustomerQueryHandling = [
    {
        mode:"insert_from_reservation",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
        INSERT INTO 
        Customers (CustomerName,CustomerEmail,Phone)
        VALUES (?,?,?)`,
        values:(data)=>[
            data.CustomerName,
            data.CustomerEmail,
            data.CustomerPhone,
        ]
    },
    {
        mode:"find",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
            SELECT CustomerID 
            from Customers 
            WHERE CustomerEmail = ?`,
        values:(data)=>[
            data.CustomerEmail
        ]
    },
    {
        mode:"register",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
        INSERT INTO Customers(CustomerName, CustomerEmail, Customer_Password, Phone) 
        VALUES (?, ?, ?, ?)`,
        values:(data)=>[
            data.CustomerName,
            data.CustomerEmail,
            data.Customer_Password,
            data.Phone
        ]
    },
    {
        mode:"get",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
        SELECT * from Customers`,
        values:(data)=>[
            data.Email || null
        ]
    },
    {
        mode:"find",
        item_type:"customerEmail",
        table_name:"Customers",
        query:(data)=>`
            select * from Customers where CustomerEmail = ?
        `,
        values:(data)=>[
            data.CustomerEmail
        ]
    },
    {
        mode:"get",
        item_type:"customer_dashboard",
        table_name:"customer, orders, order items , reservations",
        query:(data)=>`
                SELECT JSON_OBJECT(
            'CustomerDetails', JSON_OBJECT(
                'CustomerID', c.CustomerID,
                'CustomerName', c.CustomerName,
                'CustomerEmail', c.CustomerEmail,
                'Phone', c.Phone,
                'Address', c.Address,
                'LoyaltyPoints', c.LoyaltyPoints,
                'WalletBalance', c.WalletBalance,
                'TotalOrders', c.order_count,
                'TotalSpent', c.total_spend,
                'TotalLoyaltyPoints', c.totalloyaltyPoints
            ),
            'Orders', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'OrderID', o.OrderID,
                        'OrderDateTime', o.OrderDateTime,
                        'BasePriceBill', o.BasePriceBill,
                        'TaxBill', o.TaxBill,
                        'TotalBill', o.TotalBill,
                        'OrderStatus', o.OrderStatus,
                        'TableMode', o.TableMode,
                        'PickupTime', o.PickupTime,
                        'OrderPlacedBy', o.OrderPlacedBy,
                        'OrderNote', o.OrderNote,
                        'OrderDate', o.OrderDate,
                        'OrderTime', o.OrderTime,
                        'OrderItems', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'OrderItemID', oi.OrderItemID,
                                    'Quantity', oi.Quantity,
                                    'Price', oi.Price,
                                    'SpiceLevel', oi.SpiceLevel,
                                    'Item', JSON_OBJECT(
                                        'ItemID', i.ItemID,
                                        'ItemName', i.ItemName,
                                        'Description', i.Description,
                                        'Price', i.Price,
                                        'ImageURL', i.ImageURL,
                                        'IsAvailable', i.IsAvailable
                                    )
                                )
                            ) FROM OrderItems oi
                            JOIN MenuItems i ON oi.ItemID = i.ItemID
                            WHERE oi.OrderID = o.OrderID
                        )
                    )
                ) FROM Orders o
                WHERE o.CustomerID = c.CustomerID
            ),
            'Reservations', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'ReservationID', r.ReservationID,
                        'ReservationDate', r.ReservationDate,
                        'ReservationTime', r.ReservationTime,
                        'NumberOfGuests', r.NumberOfGuests,
                        'TableID_list', r.TableID_list,
                        'Preferences', r.Preferences,
                        'ReservationStatus', r.Status,
                        'ReservationType', r.Reservation_type
                    )
                ) FROM Reservations r
                WHERE r.CustomerID = c.CustomerID
            )
        ) AS CustomerData
        FROM Customers c
        WHERE c.CustomerEmail = ?; `,
        values:(data)=>[
            data.CustomerEmail
        ]
    }
]