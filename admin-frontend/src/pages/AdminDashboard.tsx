import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/StatCard";
import OrdersTable from "../components/OrdersTable";
import LowStock from "../components/LowStock";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Sales" value="12 450€" />
        <StatCard title="Orders Today" value="23" />
        <StatCard title="Total Users" value="154" />
        <StatCard title="Products" value="87" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <OrdersTable />
        </div>
        <LowStock />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
