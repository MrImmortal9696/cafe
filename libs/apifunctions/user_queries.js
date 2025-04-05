import { getLocalDate_YMD, getLocalTime } from "../hourFormat";

export const UserQueryHandling = [
    {
        mode:"register",
        type:"user",
        table_name:"Users",
        query:(data)=>`
        INSERT INTO Users(FullName, Email, PasswordHash, Role) 
        VALUES (?, ?, ?, ?)`,
        values:(data)=>[
            data.FullName,
            data.Email,
            data.PasswordHash,
            data.Role
        ]
    },
    {
        mode:"register",
        type:"customer",
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
        mode:"find",
        item_type:"access_permissions",
        table_name:"permissions",
        query: (data) => `
        SELECT p.can_access 
        FROM permissions p
        JOIN Users u ON u.role_id = p.role_id
        WHERE p.path_id = ( SELECT pathID from paths where pathName= ?) AND u.Email = ?
        LIMIT 1
    `,
        values:(data)=>[
            data.path,
            data.Email
        ]   
    },
    {
        mode:"get",
        item_type:"reservedTables",
        table:"ReservedTables",
        query:(data)=>
        `WITH Reservations AS (
    SELECT 
        rt.TableID,
        rt.ReservationID,
        rt.ReservationStatus,
        rt.ReservationStartTime,
        rt.ReservationEndTime,
        rt.ReservationDate,
        rt.ReservationEndDate,
        -- Compute AvailableAfterTime (handling midnight crossover)
        CASE 
            WHEN TIME_TO_SEC(rt.ReservationStartTime) + TIME_TO_SEC('01:30:00') >= 86400 
              THEN SEC_TO_TIME((TIME_TO_SEC(rt.ReservationStartTime) + TIME_TO_SEC('01:30:00')) % 86400)
              ELSE ADDTIME(rt.ReservationStartTime, '01:30:00') 
        END AS AvailableAfterTime,
        -- Adjust AvailableAfterDate if reservation extends past midnight
        CASE 
            WHEN TIME_TO_SEC(rt.ReservationStartTime) + TIME_TO_SEC('01:30:00') >= 86400 
              THEN DATE_ADD(rt.ReservationDate, INTERVAL 1 DAY) 
              ELSE rt.ReservationDate 
        END AS AvailableAfterDate
    FROM ReservedTables rt
)
SELECT 
    t.TableID,
    t.TableName,
    t.Floor_Value,
    t.X_Coordinate,
    t.Y_Coordinate,
    t.ChairSize,
    t.ChairCount,
    t.ChairOrientation,
    t.OrderCounts,
    DATE_FORMAT(rr.ReservationDate, '%Y-%m-%d') AS ReservationDate,
    DATE_FORMAT(rr.ReservationEndDate, '%Y-%m-%d') AS ReservationEndDate,
    rr.ReservationID,
    CASE 
        WHEN rr.ReservationID IS NOT NULL THEN 'Reserved'
        ELSE 'Available'
    END AS TableStatus,
    rr.ReservationStartTime,
    rr.ReservationEndTime,
    CONCAT(
        TIME_FORMAT(rr.AvailableAfterTime, '%h:%i %p'),
        CASE 
            WHEN rr.AvailableAfterDate > rr.ReservationDate THEN ' (Next Day)' 
            ELSE '' 
        END
    ) AS TableAvailableAfter
FROM Tables t
LEFT JOIN Reservations rr
    ON t.TableID = rr.TableID
    -- Date filtering: only consider reservations for the given day
    AND (rr.ReservationDate = ? OR rr.ReservationEndDate = ?)
    -- Time matching: join only when the provided time falls within one of the reservation scenarios
    AND (
         -- Case 1: Single-day reservation (start & end on same day)
         (rr.ReservationDate = rr.ReservationEndDate 
          AND rr.ReservationDate = ?                  
          AND TIME(?) BETWEEN TIME(rr.ReservationStartTime) AND TIME(rr.ReservationEndTime))
         OR 
         -- Case 2: Multi-day reservation (input date is within the range)
         (rr.ReservationDate <= ?
          AND (rr.ReservationEndDate IS NULL OR rr.ReservationEndDate >= ?)
          AND TIME(?) BETWEEN TIME(rr.ReservationStartTime) AND TIME(rr.AvailableAfterTime))
         OR 
         -- Case 3: Reservation spanning midnight
         ( ? BETWEEN rr.ReservationDate AND rr.ReservationEndDate 
           AND rr.ReservationDate <> rr.ReservationEndDate  
           AND (
                (rr.ReservationDate = ? AND TIME(?) >= TIME(rr.ReservationStartTime))
                OR (rr.ReservationEndDate = ? AND TIME(?) <= TIME(rr.ReservationEndTime))
           ))
         OR 
         -- Case 4: Edge case when start equals end (use a 1‑hour window)
         (rr.ReservationStartTime = rr.ReservationEndTime
          AND (rr.ReservationDate = ? OR rr.ReservationEndDate = ?)
          AND (TIME(?) >= TIME(rr.ReservationStartTime)
               AND TIME(?) < TIME(ADDTIME(rr.ReservationStartTime, '01:00:00'))))
    );


` ,
values: (data) => [
    // LEFT JOIN clause – filtering reservations by date
    data.ReservationDate ?? getLocalDate_YMD(), // (1) For: rr.ReservationDate = ?
    data.ReservationDate ?? getLocalDate_YMD(), // (2) For: rr.ReservationEndDate = ?

    // CASE – Case 1: Single-day reservation
    data.ReservationDate ?? getLocalDate_YMD(), // (3) For: rr.ReservationDate = ?
    data.ReservationTime ?? getLocalTime(),     // (4) For: TIME(?) between ReservationStartTime and ReservationEndTime

    // CASE – Case 2: Multi-day reservation
    data.ReservationDate ?? getLocalDate_YMD(), // (5) For: rr.ReservationDate <= ?
    data.ReservationDate ?? getLocalDate_YMD(), // (6) For: rr.ReservationEndDate >= ?
    data.ReservationTime ?? getLocalTime(),     // (7) For: TIME(?) between ReservationStartTime and AvailableAfterTime

    // CASE – Case 3: Reservation spanning midnight
    data.ReservationDate ?? getLocalDate_YMD(), // (8) For: ? BETWEEN rr.ReservationDate AND rr.ReservationEndDate
    data.ReservationDate ?? getLocalDate_YMD(), // (9) For: rr.ReservationDate = ?
    data.ReservationTime ?? getLocalTime(),     // (10) For: TIME(?) >= TIME(rr.ReservationStartTime)
    data.ReservationDate ?? getLocalDate_YMD(), // (11) For: rr.ReservationEndDate = ?
    data.ReservationTime ?? getLocalTime(),     // (12) For: TIME(?) <= TIME(rr.ReservationEndTime)

    // CASE – Case 4: Edge case when start equals end
    data.ReservationDate ?? getLocalDate_YMD(), // (13) For: rr.ReservationDate = ? (OR part)
    data.ReservationDate ?? getLocalDate_YMD(), // (14) For: rr.ReservationEndDate = ? (OR part)
    data.ReservationTime ?? getLocalTime(),     // (15) For: TIME(?) >= TIME(rr.ReservationStartTime)
    data.ReservationTime ?? getLocalTime(),     // (16) For: TIME(?) < TIME(ADDTIME(rr.ReservationStartTime, '01:00:00'))
]



    },    
    {
        mode:"get",
        item_type:"users",
        table:"Users",
        query:(data)=>`
        SELECT UserID, FullName, Email, PasswordHash, role_id from Users`,
        values:(data)=>[
            data.Email || null
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
        mode:"update",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
        UPDATE Customers 
        SET 
        CustomerName = ?,
        Customer_Password = ?,
        Phone = ?,
        Address = ?,
        LoyaltyPoints = ?,
        WalletBalance = ?
        where CustomerID = ?
        `,
        values:(data)=>[
            data.CustomerName,
            data.Customer_Password,
            data.Phone,
            data.Address,
            data.LoyaltyPoints,
            data.WalletBalance,
            data.CustomerID
        ]
    },
    {
        mode:"delete",
        item_type:"customer",
        table_name:"Customers",
        query:(data)=>`
        DELETE FROM Customers where CustomerID = ?`,
        values:(data)=>[
            data.CustomerID
        ]
    },
    
    {
        mode:"find",
        item_type:"users",
        table:"Users",
        query:(data)=>`
        SELECT EXISTS ( SELECT 1 from Users where Email = ? ) as email_exists`,
        values:(data)=>[
            data.Email 
        ]
    },
    {
        mode:"get",
        item_type:"roles",
        table:"Roles",
        query:(data)=>`
        SELECT * from Roles`,
        values:(data)=>[
            data.Email || null
        ]
    },
    {
        mode:"get",
        item_type:"paths",
        table:"paths",
        query:(data)=>`
        SELECT * from paths`,
        values:(data)=>[
            data.Email || null
        ]
    },
    {
        mode:"get",
        item_type:"permissions",
        table:"permissions",
        query:(data)=>`
        SELECT * from permissions`,
        values:(data)=>[
            data.Email || null
        ]
    },
    {
        mode:"get",
        item_type:"user_permissions",
        table:"permissions",
        query:(data)=>`
            SELECT 
                p.pathName, 
                p.name AS PathName,
                p.pathID
            FROM Users u
            JOIN Roles r ON u.role_id = r.id
            JOIN permissions perm ON r.id = perm.role_id
            JOIN paths p ON perm.path_id = p.pathID
            WHERE u.Email = ? 
            AND perm.can_access = 1;
        `,
        values:(data)=>[
            data.Email 
        ]
    },
    {
        mode:"update",
        item_type:"users",
        table:"Users",
        query:(data)=>`
            UPDATE Users 
            SET
            FullName = ?,
            PasswordHash = ?,
            role_id = ?
            WHERE UserID = ? and mutable = 1; 
        `,
        values:(data)=>[
            data.FullName,
            data.PasswordHash,
            data.role_id,
            data.UserID
        ]
    },
    {
        mode:"insert",
        item_type:"users",
        table:"Users",
        query:(data)=>`
        INSERT INTO Users 
        (FullName, Email, PasswordHash, role_id) 
        Values(?,?,?,?)`,
        values:(data)=>[
            data.FullName,
            data.Email,
            data.PasswordHash,
            data.role_id
        ]
    },
    {
        mode:"delete",
        item_type:"users",
        table:"Users",
        query:(data)=>`
        DELETE FROM Users WHERE UserID = ? and mutable = 1`,
        values:(data)=>[
            data.UserID,
        ]
    },
    {
        mode:"insert",
        item_type:"roles",
        table:"Roles",
        query:(data)=>`
        INSERT INTO Roles 
        (name) 
        Values( ? )`,
        values:(data)=>[
            data.name,
        ]
    },
    {
        mode:"update",
        item_type:"roles",
        table:"Roles",
        query:(data)=>`
        UPDATE Roles 
        SET name = ?
        WHERE id = ?`,
        values:(data)=>[
            data.name,
            data.id
        ]
    },
    {
        mode:"delete",
        item_type:"roles",
        table:"Roles",
        query:(data)=>`
        DELETE from Roles 
        where id = ?`,
        values:(data)=>[
            data.roleID
        ]
    },
    {
        mode: "update",
        item_type: "permission_access",
        table: "permissions",
        query: (data) => {
          // Dynamically create the VALUES part of the query
          const values = data.selectedPaths
            .map(() => "(?, ?, ?)")  // For each path, insert pathId, roleId, and can_access
            .join(", ");
          
          return `
            INSERT INTO permissions (path_id, role_id, can_access)
            VALUES ${values}
            ON DUPLICATE KEY UPDATE
                can_access = IF(mutable = 1, VALUES(can_access), can_access);

          `;
        },
        values: (data) => {
          // Flatten the selectedPaths array to extract pathId, roleId, and can_access for each path
          return data.selectedPaths.flatMap((path) => [
            path.pathID,  // pathId
            data.roleID,  // roleId (assumed to be part of the data)
            path.can_access // can_access (the value you want to update)
          ]);
        }
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
                        'Customer_Password', c.Customer_Password,
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
                                'TotalBill', o.TotalBill,
                                'WalletPayment', o.WalletPayment,
                                'NormalPayment', o.NormalPayment,
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
                                            ),
                                            'Options', oi.Options
                                        )
                                    ) 
                                    FROM OrderItems oi
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
                                'ReservationDate', DATE_FORMAT(r.ReservationDate, '%Y-%m-%d'),
                                'NumberOfGuests', r.NumberOfGuests,
                                'Preferences', r.Preferences,
                                'Reservation_Status', r.Reservation_Status,
                                'ReservationType', r.Reservation_type,
                                'Tables', (
                                    SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'TableID', t.TableID,
                                            'TableName', t.TableName,
                                            'Floor_Value', t.Floor_Value
                                        )
                                    ) 
                                    FROM Tables t
                                    WHERE JSON_CONTAINS(r.TableID_list, CAST(t.TableID AS JSON))
                                )
                            )
                        ) FROM Reservations r
                        WHERE r.CustomerID = c.CustomerID
                    )
                ) AS CustomerData
        FROM Customers c
        WHERE c.CustomerEmail = ?;`,
        values:(data)=>[
            data.CustomerEmail
        ]
    },
    {
        mode:"get",
        item_type:"dashboard_summary",
        table:"DashboardSummary",
        query:(data)=>`
        select * from DashboardSummary`,
        values:(data)=>[

        ]
    },
    {
        mode:"get",
        item_type:"order_overview",
        table:"OrderOverview",
        query:(data)=>`
        select * from OrderOverview`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"order_overview_monthly",
        table:"OrderOverview",
        query:(data)=>`
        select * from MonthlyOrderOverview`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"top_selling_monthly",
        table:"OrderOverview",
        query:(data)=>`
        select * from MonthlyTopSellingItems`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"today_orders_status",
        table:"OrderStatus",
        query:(data)=>`
        select * from OrderSummary where OrdersToday = ?`,
        values:(data)=>[
            data.OrderDate
        ]
    },
    {
        mode:"get",
        item_type:"today_pending_orders",
        table:"OrderStatus",
        query:(data)=>`
            select PendingOrders from OrderSummary where OrdersToday = ?`,
        values:(data)=>[
            data.OrderDate
        ]
    },
    {
        mode:"get",
        item_type:"today_ongoing_reservations",
        table:"OrderStatus",
        query:(data)=>`
            select OngoingReservations from ReservationSummary where ReservationsToday = ?`,
        values:(data)=>[
            data.ReservationDate
        ]
    },
    {
        mode:"get",
        item_type:"categoriesOverview",
        table:"CategoryOrderCount",
        query:(data)=>`
        select * from CategoryOrderCounts where TotalOrderCount > 0`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"monthly_categories_overview",
        table:"CategoryOrderCount",
        query:(data)=>`
        select * from MonthlyCategoryOrderCounts where TotalOrderCount > 0`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"order_trends_time",
        table:"OrderTrendsByTime",
        query:(data)=>`
        select * from OrderTrendsByTime`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"order_trends_time_monthly",
        table:"OrderTrendsByTimeMonthly",
        query:(data)=>`
        select * from OrderTrendsByTimeMonthly`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"dashboard_summary_monthly",
        table:"DashboardSummaryByMonth",
        query:(data)=>`
        select * from DashboardSummaryByMonth`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"top_selling_item",
        table:"TopSellingItems",
        query:(data)=>`
        select * from TopSellingItems limit 5`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"orderMode_analytics",
        table:"OrderModeAnalytics",
        query:(data)=>`
        select * from OrderModeAnalytics`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"monthly_orderMode_analytics",
        table:"OrderModeAnalytics",
        query:(data)=>`
        select * from MonthlyOrderModeAnalytics`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"finance_dashbaord",
        table:"FinanceDashboard",
        query:(data)=>`
        SELECT * from FinanceDashboard where FinanceID = 1`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"billing_tax_amount",
        table:"FinanceDashboard",
        query:(data)=>`
        SELECT TaxPercent from FinanceDashboard where FinanceID = 1`,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"billing_tax_list",
        table:"Taxes",
        query:(data)=>`
        SELECT * from Taxes`,
        values:(data)=>[]
    },
    {
        mode:"insert",
        item_type:"insert_tax",
        table:"Taxes",
        query:(data)=>`
        INSERT INTO Taxes (TaxName,TaxPercentage,Active) values(?,?,?)`,
        values:(data)=>[
            data.TaxName,
            data.TaxPercentage,
            data.Active
        ]
    },
    {
        mode:"update",
        item_type:"update_tax",
        table:"Taxes",
        query:(data)=>`
        UPDATE Taxes 
        SET 
        TaxName = ?,
        TaxPercentage = ?,
        Active = ?
        where TaxID = ?`,
        values:(data)=>[
            data.TaxName,
            data.TaxPercentage,
            data.Active,
            data.TaxID
        ]
    },
    {
        mode:"delete",
        item_type:"delete_tax",
        table:"Taxes",
        query:(data)=>`
        DELETE from Taxes where TaxID = ?`,
        values:(data)=>[
            data.TaxID
        ]
    },
    {
        mode:"get",
        item_type:"wallet_balance",
        table:"Customers",
        query:(data)=>`
        SELECT WalletBalance from Customers where CustomerEmail = ?`,
        values:(data)=>[
            data.CustomerEmail
        ] 
    },
    {
        mode:"update",
        item_type:"wallet_balance",
        table:"Customers",
        query:(data)=>`
        UPDATE Customers SET
        WalletBalance = ?
        where CustomerEmail = ?`,
        values:(data)=>[
            data.WalletBalance,
            data.CustomerEmail
        ] 
    },
    {
        mode:"update",
        item_type:"financeDashboard",
        table:"FinanceDashboard",
        query:(data)=>`
        UPDATE FinanceDashboard 
        SET
        TaxPercent = ?,
        LoyaltyPointsPercentage = ?,
        LoyaltyRedeemingRequirement = ?,
        TableReservationFee = ?
        where FinanceID = 1 `,
        values:(data)=>[
            data.TaxPercent,
            data.LoyaltyPointsPercentage,
            data.LoyaltyRedeemingRequirement,
            data.TableReservationFee
        ]
    },
    {
        mode:"update",
        item_type:"customer_dashboard",
        table_name:"Customers",
        query:(data)=>`
        UPDATE Customers 
        SET 
        CustomerName = ?,
        Customer_Password = ?,
        Phone = ?,
        Address = ?
        where CustomerID = ?
        `,
        values:(data)=>[
            data.CustomerName,
            data.Customer_Password,
            data.Phone,
            data.Address,
            data.CustomerID
        ]
    },
    {
        mode:"get",
        item_type:"menuItems_menuTypewise",
        table_name:"MenuItems",
        query:(data)=>`
        SELECT JSON_OBJECT(
            'MenuTypeID', MT.MenuTypeID,
            'MenuTypeName', MT.MenuTypeName,
            'slug',MT.slug,
            'Categories', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'CategoryID', MC.CategoryID,
                        'CategoryName', MC.CategoryName,
                        'Description', MC.Description,
                        'dishes_count', MC.dishes_count,
                        'Items', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'ItemID', MI.ItemID,
                                    'ItemName', MI.ItemName,
                                    'Description', MI.Description,
                                    'Price', MI.Price,
                                    'Options', MI.Options,
                                    'ImageURL', MI.ImageURL,
                                    'IsAvailable', MI.IsAvailable,
                                    'SpiceLevel', MI.SpiceLevel,
                                    'ShortCode', MI.ShortCode,
                                    'order_count', MI.order_count
                                )
                            ) FROM MenuItems MI WHERE MI.CategoryID = MC.CategoryID
                        )
                    )
                ) FROM MenuCategories MC WHERE MC.MenuTypeID = MT.MenuTypeID
            )
        ) AS MenuHierarchy
        FROM MenuTypes MT where MT.slug = ?;

        `,
        values:(data)=>[data.MenuType]
    },
    {
        mode:"get",
        item_type:"typewise_menu",
        table:"MenuTypes",
        query:(data)=>`
                    SELECT 
                mt.MenuTypeID,
                mt.MenuTypeName,
                mt.slug,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'CategoryID', mc.CategoryID,
                        'CategoryName', mc.CategoryName,
                        'Description', mc.Description,
                        'dishes_count', mc.dishes_count,
                        'MenuItems', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'ItemID', mi.ItemID,
                                    'ItemName', mi.ItemName,
                                    'Description', mi.Description,
                                    'Price', mi.Price,
                                    'Options', mi.Options,
                                    'ImageURL', mi.ImageURL,
                                    'IsAvailable', mi.IsAvailable,
                                    'SpiceLevel', mi.SpiceLevel,
                                    'ShortCode', mi.ShortCode,
                                    'order_count', mi.order_count
                                )
                            ) 
                            FROM MenuItems mi
                            WHERE mi.CategoryID = mc.CategoryID AND mi.IsAvailable = 1
                        )
                    )
                ) AS Categories
            FROM MenuTypes mt
            JOIN MenuCategories mc ON mt.MenuTypeID = mc.MenuTypeID
            WHERE mt.slug = ? 
            GROUP BY mt.MenuTypeID `,
        
            values:(data)=>[
                    data.MenuType
            ]
    },
    {
        mode:"get",
        item_type:"menuTypes",
        query:(data)=>`
        SELECT * from MenuTypes;
        `,
        values:(data)=>[]
    },
    {
        mode:"get",
        item_type:"current_date_reservations",
        query:(data)=>`
           SELECT 
            r.ReservationID,
            r.CustomerID,
            DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') AS ReservationDate,
            TIME_FORMAT(r.ReservationTime, '%h:%i') AS ReservationTime,
            r.NumberOfGuests,
            r.Preferences,
            r.Status,
            r.Reservation_type,
            r.Reservation_Status,
            r.CreatedAt,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'TableID', t.TableID,
                    'TableName', t.TableName,
                    'Floor_Value', t.Floor_Value
                )
            ) AS Tables
        FROM Reservations r
        LEFT JOIN Tables t 
            ON JSON_CONTAINS(r.TableID_list, CAST(t.TableID AS JSON)) -- Join Tables based on JSON TableID_list
        WHERE 
        r.ReservationDate = ? and 
        CustomerID = (select CustomerID from Customers where CustomerEmail = ?) and 
        r.Reservation_Status = "ongoing"

        GROUP BY r.ReservationID;
                
        `,
        values:(data)=>[
            data.CurrentDate,
            data.CustomerEmail
        ]
    },
    {
        mode:"get",
        item_type:"complete_order_data",
        query:(data)=>`
            SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'OrderID', o.OrderID,
        'CustomerID', o.CustomerID,
        'CustomerName', c.CustomerName,
        'CustomerEmail', c.CustomerEmail,
        'OrderDateTime', o.OrderDateTime,
        'OrderDate', o.OrderDate,
        'OrderTime', DATE_FORMAT(o.OrderTime, '%h:%i %p'), -- Format OrderTime to AM/PM
        'BasePriceBill', o.BasePriceBill,
        'TaxBill', o.TaxBill,
        'TotalBill', o.TotalBill,
        'OrderStatus', o.OrderStatus,
        'TableMode', o.TableMode,
        'PickupTime', o.PickupTime,
        'OrderPlacedBy', o.OrderPlacedBy,
        'OrderNote', o.OrderNote,
        'PaymentMode', o.PaymentMode,
        'WalletPayment', o.WalletPayment,
        'NormalPayment', o.NormalPayment,

        -- Reservation Details
        'Reservation', JSON_OBJECT(
            'ReservationID', r.ReservationID,
            'ReservationDate', r.ReservationDate,
            'ReservationTime', DATE_FORMAT(r.ReservationTime, '%h:%i %p'), -- Format ReservationTime to AM/PM
            'NumberOfGuests', r.NumberOfGuests,
            'ReservedTables', r.TableID_list,
            'ReservationStatus', r.Status,

            -- Tables Data from TableID_list
            'Tables', COALESCE((
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'TableID', t.TableID,
                        'TableName', t.TableName,
                        'Floor_Value', t.Floor_Value
                    )
                )
                FROM Tables t
                WHERE JSON_CONTAINS(r.TableID_list, CAST(t.TableID AS JSON))
            ), JSON_ARRAY()) -- Ensures an empty array instead of NULL
        ),

        -- Order Items as an array
        'OrderItems', COALESCE((
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'OrderItemID', oi.OrderItemID,
                    'Quantity', oi.Quantity,
                    'Options', oi.Options,
                    'Price', oi.Price,
                    'SpiceLevel', oi.SpiceLevel,

                    -- Menu Item Details inside Order Item
                    'MenuItem', JSON_OBJECT(
                        'ItemID', mi.ItemID,
                        'ItemName', mi.ItemName,
                        'Description', mi.Description,
                        'Price', mi.Price,
                        'Options', mi.Options,
                        'ImageURL', mi.ImageURL,
                        'IsAvailable', mi.IsAvailable,
                        'SpiceLevel', mi.SpiceLevel
                    )
                )
            ) 
            FROM OrderItems oi
            LEFT JOIN MenuItems mi ON oi.ItemID = mi.ItemID
            WHERE oi.OrderID = o.OrderID
        ), JSON_ARRAY()) -- Ensures an empty array instead of NULL
    )
) AS OrdersJSON
FROM Orders o
LEFT JOIN Reservations r ON o.ReservationID = r.ReservationID
LEFT JOIN Customers c ON o.CustomerID = c.CustomerID;`,
        values:(data)=>[]
    },
    {
        mode:"update",
        item_name:"MenuItemImage",
        table:"MenuItems",
        query:(data)=>`
            UPDATE MenuItems
            SET ImageURL = ?, ImagePublicID = ? where ItemID = ?;`,
        values:(data)=>[
            data.ImageURL,
            data.ImagePublicID,
            data.ItemID
        ]
    },
    {
        mode:"delete",
        item_name:"MenuItemImage",
        table:"MenuItems",
        query:(data)=>`
            UPDATE MenuItems
            SET ImageURL = NULL, ImagePublicID = NULL where ItemID = ?;`,
        values:(data)=>[
            data.ItemID
        ]
    }
]


