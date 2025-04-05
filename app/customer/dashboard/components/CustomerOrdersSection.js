import RecentOrders from "./RecentOrders";

export default function CustomerOrdersSection({ orders }) {
  const reversedOrders = [...(orders || [])].reverse();

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
      {reversedOrders.map((order, index) => (
        <RecentOrders order={order} key={index} />
      ))}
    </div>
  );
}
