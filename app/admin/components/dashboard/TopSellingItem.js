export default function TopSellingItem({item,index}){

    return (
        <div className="flex flex-col border-2 bg-white border-orange-200 rounded-xl p-2">
            <div className="flex gap-2 text-xl font-semibold">
                <span className="text-orange-400">#{index}</span>
                <span>{item.ItemName}</span>
            </div>
            <div className="flex  justify-end gap-2">
                <div className="grid grid-cols-2 items-center gap-2" >
                    <span className="text-md ">Total Revenue</span>
                    <span className="text-xl font-semibold">£ {item.TotalRevenueGenerated}</span>
                    <span className="text-md ">Quantity Sold</span>
                    <span className="text-xl font-semibold">{item.TotalQuantitySold}</span>
                    <span className="text-md ">Times Ordered</span>
                    <span className="text-xl font-semibold">{item.TotalTimesOrdered}</span>
                </div>
            </div>
        </div>
    )
}