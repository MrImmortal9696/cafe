export default function ReservationTablesListElement({Tables}){
    return (
        <div className="py-2 px-1 flex-center w-full  overflow-auto no-scrollbar flex-wrap gap-2">
        {Tables.map((table, index) => (
            <div key={table.TableID} className="relative px-4 py-2 border border-zinc-700 rounded-lg">
                <span>{table.TableName}</span>
                <div className="absolute p-2 bg-orange-300 text-orange-600 flex-center -top-2 -right-2 
                                w-[20px] h-[20px] text-[12px] rounded-full font-bold">
                    {table.Floor_Value}
                </div>
            </div>
        ))}
    </div>
    )
}