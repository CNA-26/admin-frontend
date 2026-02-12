const OrdersTable = () => {
  const orders = [
    { id: 1, customer: "Alice", total: "45€", status: "Completed" },
    { id: 2, customer: "Bob", total: "89€", status: "Pending" },
    { id: 3, customer: "Charlie", total: "120€", status: "Shipped" },
  ];

  return (
    <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="pb-2">ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
