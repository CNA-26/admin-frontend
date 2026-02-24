import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/dashboard/StatCard";
import OrdersTable from "../components/dashboard/OrdersTable";
import LowStock from "../components/dashboard/LowStock";
import { productApi } from "../api/productApi";
import { userApi } from "../api/userApi";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  usersCreatedToday: number;
  usersCreatedThisWeek: number;
  avgProductPrice: number;
  maxProductPrice: number;
  minProductPrice: number;
  productsCreatedToday: number;
  productsCreatedThisWeek: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    usersCreatedToday: 0,
    usersCreatedThisWeek: 0,
    avgProductPrice: 0,
    maxProductPrice: 0,
    minProductPrice: 0,
    productsCreatedToday: 0,
    productsCreatedThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await productApi.get("/products");
        const products = productsRes.data || [];
        const productCount = products.length;

        // Fetch users
        const usersRes = await userApi.get("api/auth/users");
        const users = usersRes.data || [];
        const userCount = users.length;

        // Calculate dates
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Calculate users created today and this week
        const usersCreatedToday = users.filter((user: any) => {
          const createdDate = new Date(user.createdAt);
          return createdDate >= todayStart;
        }).length;

        const usersCreatedThisWeek = users.filter((user: any) => {
          const createdDate = new Date(user.createdAt);
          return createdDate >= weekAgo;
        }).length;

        // Calculate product stats
        const prices = products.map((p: any) => p.price).filter((p: number) => !isNaN(p));
        const avgProductPrice = prices.length > 0 ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : 0;
        const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const minProductPrice = prices.length > 0 ? Math.min(...prices) : 0;

        const productsCreatedToday = products.filter((product: any) => {
          const createdDate = new Date(product.created_at);
          return createdDate >= todayStart;
        }).length;

        const productsCreatedThisWeek = products.filter((product: any) => {
          const createdDate = new Date(product.created_at);
          return createdDate >= weekAgo;
        }).length;

        setStats({
          totalUsers: userCount,
          totalProducts: productCount,
          usersCreatedToday,
          usersCreatedThisWeek,
          avgProductPrice,
          maxProductPrice,
          minProductPrice,
          productsCreatedToday,
          productsCreatedThisWeek,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Users" value={loading ? "..." : stats.totalUsers.toString()} />
        <StatCard title="New Users Today" value={loading ? "..." : stats.usersCreatedToday.toString()} />
        <StatCard title="New Users This Week" value={loading ? "..." : stats.usersCreatedThisWeek.toString()} />
        <StatCard title="Total Products" value={loading ? "..." : stats.totalProducts.toString()} />
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Avg Product Price" value={loading ? "..." : stats.avgProductPrice + "€"} />
        <StatCard title="Most Expensive" value={loading ? "..." : stats.maxProductPrice + "€"} />
        <StatCard title="Least Expensive" value={loading ? "..." : stats.minProductPrice + "€"} />
        <StatCard title="New Products This Week" value={loading ? "..." : stats.productsCreatedThisWeek.toString()} />
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
