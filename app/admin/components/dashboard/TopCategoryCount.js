export default function TopCategoryCount({categoryOrderCounts}){
    return (
        <div className="text-center grid gap-2">
        <div className="grid grid-cols-8 text-lg font-bold">
                {/* <span >No. </span> */}
                <span className="col-span-5 text-start">Category </span>
                <span className="col-span-3">Total Orders </span>
            </div>
        <div className="grid gap-2">
        {categoryOrderCounts.map((item,index)=>(
            <div 
            key={index}
            className="grid grid-cols-8">
                {/* <span>{item.CategoryID}</span> */}
                <span className="col-span-5 text-start text-lg ">{item.CategoryName}</span>
                <span className="col-span-3 text-xl font-semibold">{item.TotalOrderCount}</span>
            </div>
        ))}
        </div>
        </div>
    )
}