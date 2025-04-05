import { NextResponse } from "next/server";
import { connect_mysql } from "@/libs/mysql";

export async function GET(req,res){
    try{
        const [orders] = await connect_mysql.query
        (`SELECT 
            o.OrderID,cu.CustomerName,
            cu.CustomerEmail, o.BasePriceBill,o.PaymentMode,
            o.TaxBill, o.TotalBill,
            o.OrderStatus, o.TableMode, o.PickupTime,
            o.OrderPlacedBy, o.OrderNote, o.WalletPayment, o.NormalPayment,
            DATE_FORMAT(o.OrderDate, '%Y-%m-%d') AS OrderDate,
            o.OrderTime AS TimeOfOrder,
            DATE_FORMAT(o.OrderTime, '%h:%i %p') AS OrderTime,
            o.OrderDateTime
             FROM Orders o join Customers cu on cu.CustomerID = o.CustomerID `)

        const [order_items] = await connect_mysql.query(
            `SELECT *,oi.Price as Price,oi.Options as Options from OrderItems oi join MenuItems mi on oi.ItemID = mi.ItemID `
        )
        const ordersArray = orders.map((order,index)=>({
            ...order,
            items:order_items.filter((item,index)=>order.OrderID === item.OrderID)
    }))

        return NextResponse.json({ordersArray})

    }
    catch(error){
        console.log(error)
        return NextResponse.json(error)
    }
}