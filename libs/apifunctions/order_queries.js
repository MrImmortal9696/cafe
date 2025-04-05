export const CartOrderHandling = [
    {
      mode: "insert",
      item_type: "cart_item",
      table_name: "CartItems",
      query: (data) => `
        INSERT INTO CartItems (
            CartID, 
            ItemID,
            Quantity,
            BasePrice,
            CartItemId,
            SpiceLevel,
            Options
        )
        VALUES 
        ${data.cart.map(() => `( 
            (SELECT CartID FROM Cart WHERE CustomerID = 
            (SELECT CustomerID FROM Customers WHERE CustomerEmail = ?)),
            ?, ?, ?, ?, ?, ?
            )`).join(",")}
        ON DUPLICATE KEY UPDATE 
            Quantity = VALUES(Quantity),
            Options = VALUES(Options),
            BasePrice = VALUES(BasePrice)
        `,

        values: (data) => {
            const valuesArray = [];
          
            data.cart.forEach((item) => {
              valuesArray.push(data.CustomerEmail);  // CustomerEmail for Cart lookup
              valuesArray.push(item.id);             // ItemID
              valuesArray.push(item.quantity);       // Quantity
              valuesArray.push(item.basePrice);      // BasePrice
              valuesArray.push(item.itemKey);        // CartItemID
              valuesArray.push(item.SpiceLevel);        // CartItemID
          
              // Handling selections properly
              valuesArray.push(
                item.selections && item.selections.length > 0
                  ? JSON.stringify(item.selections.map(selection => ({
                      name: selection.name,
                      price: selection.price
                    })))
                  : null
              );
            });
          
            return valuesArray;
          }
          
    },
    {
        mode:"update",
        item_type:"cart_bill",
        table_name: "CartItems",

        query:(data)=>`
            UPDATE Cart c
            SET 
            BasePriceBill = ?,
            TaxBill = ?,
            TotalBill = ?
            WHERE CustomerID = (SELECT CustomerID from Customers where CustomerEmail = ?)
        `,
        values:(data)=>[
            data.BasePriceBill,
            data.TaxBill,
            data.TotalBill,
            data.CustomerEmail
        ]
    },
    {
        mode:"get",
        item_type:"orderID",
        table_name: "Orders",

        query:(data)=>`
            UPDATE Cart c
            SET 
            BasePriceBill = ?,
            TaxBill = ?,
            TotalBill = ?
            WHERE CustomerID = (SELECT CustomerID from Customers where CustomerEmail = ?)
        `,
        values:(data)=>[
            data.BasePriceBill,
            data.TaxBill,
            data.TotalBill,
            data.CustomerEmail
        ]
    },
    {
        mode:"insert",
        item_type:"order_items",
        table_name: "OrderItems",
        query:(data)=>`
            INSERT INTO OrderItems (
                OrderID,
                ItemID,
                Quantity,
                ItemOptionsId,
                Price,
                SpiceLevel,
                Options
            )
            VALUES
            ${data.cart.map(()=>`(
                (SELECT OrderID FROM Orders WHERE CustomerID = (
                SELECT CustomerID from Customers WHERE CustomerEmail = ?) 
                ORDER BY OrderDateTime DESC LIMIT 1),
                ?, ?, ?, ?, ?, ?)`).join(",")}`,
        values:(data)=>{
            const valuesArray = [];
            data.cart.forEach((item)=>{
                valuesArray.push(data.CustomerEmail)
                valuesArray.push(item.id)
                valuesArray.push(item.quantity)
                valuesArray.push(item.itemKey)
                valuesArray.push(item.totalPrice)
                valuesArray.push(item.SpiceLevel)
                valuesArray.push(
                    item.selections && item.selections.length > 0 ?
                    JSON.stringify(item.selections.map(selection=>({
                        name:selection.name,
                        price:selection.price
                    })))
                    : null 
                )
            })
            return valuesArray
        }
    },
    {
        mode: "insert",
        item_type: "cart_Orders",
        table_name: "Orders",
        query: (data) => `
            INSERT INTO Orders (
                CustomerID, CartID, BasePriceBill, TaxBill, TotalBill, 
                OrderStatus, TableMode, PickupTime, OrderNote, 
                OrderPlacedBy, OrderDate, OrderTime, PaymentMode, pendingLoyaltyPoints,
                WalletPayment,NormalPayment,ReservationID
            ) 
            VALUES (
                (SELECT CustomerID FROM Customers WHERE CustomerEmail = ?),
                (SELECT CartID FROM Cart WHERE CustomerID = 
                    (SELECT CustomerID FROM Customers WHERE CustomerEmail = ?)
                ),
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                CASE 
                    WHEN ? = 'Wallet' THEN 0
                    ELSE (? * (SELECT LoyaltyPointsPercentage FROM FinanceDashboard WHERE FinanceID = 1) / 100)
                END,
                ?,?,?
            );
        `,
        values: (data) => [
            data.CustomerEmail,
            data.CustomerEmail,
            data.BasePriceBill,
            data.TaxBill,
            data.TotalBill,
            data.OrderStatus || "Pending",
            data.TableMode,
            data.PickupTime || null,
            data.OrderNote,
            data.OrderPlacedBy,
            data.OrderDate,
            data.OrderTime,
            data.PaymentMode, // Passed to CASE WHEN logic
            data.PaymentMode, // Used in CASE WHEN condition
            data.finalBill, // Used for loyalty points calculation if applicable
            data.walletBill,
            data.finalBill,
            data.ReservationID
        ]
    },      
    {
        mode:"update",
        item_type:"Order_billing",
        table_name: "Customers",
        query:(data)=>`
           UPDATE Customers 
           set 
           order_count = order_count + 1,
           total_spend = total_spend + ?,
           total_basic_spend = total_basic_spend + ?
           where CustomerEmail = ?
        `,
        values:(data)=>[
            data.TotalBill,
            data.BasePriceBill,
            data.CustomerEmail,
        ]
    },
    {
        mode:"update",
        item_type:"Wallet_Order_billing",
        table_name: "Customers",
        query:(data)=>`
           UPDATE Customers 
           set 
           order_count = order_count + 1,
           total_spend = total_spend + ?,
           total_basic_spend = total_basic_spend + ?,
           WalletBalance = ?
           where CustomerEmail = ?
        `,
        values:(data)=>[
            data.TotalBill,
            data.BasePriceBill,
            data.WalletBalance,
            data.CustomerEmail,
        ]
    },
    {
        mode:"update",
        item_type:"orders",
        table_name: "Orders",
        query:(data)=>`
           UPDATE Orders 
           SET 
           OrderStatus = ?,
           TableMode = ?,
           PickupTime = ?
           WHERE OrderID = ?
        `,
        values:(data)=>[
            data.OrderStatus,
            data.TableMode,
            data.PickupTime,
            data.OrderID
        ]
    } ,{
        mode:"delete",
        item_type:"orders",
        table_name: "Orders",
        query:(data)=>`
           DELETE FROM Orders 
           WHERE OrderID = ?
        `,
        values:(data)=>[
            data.OrderID
        ]
    }
  ];
  