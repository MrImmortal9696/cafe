export default function OrderModeCount({orderModeAnalytics}){
    return (
        <div className="text-center grid gap-2">
        <div className="grid grid-cols-8 text-lg font-bold">
                <span className="col-span-3 text-start">Table Mode </span>
                <span className="col-span-3 ">Orders</span>
                <span className="col-span-2"> Revenue  </span>
            </div>
        <div className="grid gap-2">
        {orderModeAnalytics.map((item,index)=>(
            <div 
            key={index}
            className="grid grid-cols-8">
                <span className="col-span-3 text-start">{item.TableMode}</span>
                <span className="col-span-3 text-center ">{item.OrderCount}</span>
                <span className="col-span-2 font-semibold"> £ {item.RevenueGenerated}</span>         
            </div>
        ))}
        </div>
        </div>
    )
}