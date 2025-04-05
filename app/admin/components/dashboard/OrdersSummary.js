export default function OrdersSummary({ data }) {
    if (!data) {
        return (
            <div className="w-full p-4 border-2 rounded-xl flex flex-col gap-4 shadow-xl text-center bg-white">
                <span className="font-semibold text-xl">Orders Summary</span>
                <div className="p-4 bg-gray-100 rounded-lg text-gray-500">
                    No order data available.
                </div>
            </div>
        );
    }

    const ordersDataCounts = [
        { title: "Preparing", countData: data?.PreparingOrders || 0 },
        { title: "Completed", countData: data?.CompletedOrders || 0 },
        { title: "Cancelled", countData: data?.CancelledOrders || 0 }
    ];

    return (
        <div className="w-full p-4  rounded-xl flex flex-col gap-4  bg-white">
            <div className="flex justify-between w-full">
                <span className="font-semibold text-xl">Orders Summary</span>
                <span className="font-medium">{data?.OrdersToday || 0}</span>
            </div>

            <div className="flex p-4 bg-green-100 rounded-lg items-center gap-4">
                <div className="bg-green-500 px-6 p-2 rounded-lg text-xl font-bold text-white">
                    {data?.PendingOrders || 0}
                </div>
                <div>
                    <span className="font-semibold text-xl">New Orders</span>
                </div>
            </div>

            <div className="flex justify-evenly">
                {ordersDataCounts.map((item, index) => (
                    <div className="px-4 p-2 rounded-lg border flex text-center flex-col" key={index}>
                        <span className="text-[36px] font-semibold">{item?.countData}</span>
                        <span className="font-semibold">{item?.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
