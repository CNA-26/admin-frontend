import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/dashboard/StatCard";
import OrdersTable from "../components/dashboard/OrdersTable";
import LowStock from "../components/dashboard/LowStock";
import { productApi } from "../api/productApi";
import { userApi } from "../api/userApi";
import { inventoryApi } from "../api/inventoryApi";
import { getAccessToken } from "../auth/token";

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
  totalInventoryUnits: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
}

interface Product {
  product_code: string;
  price: number;
  created_at: string;
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
    totalInventoryUnits: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    inventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await productApi.get("/products");
        const products: Product[] = productsRes.data || [];
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

        const accessToken = getAccessToken();
        const inventoryRows = await Promise.all(
          products.map(async (product) => {
            try {
              const response = await inventoryApi.get(
                `/api/products/${encodeURIComponent(product.product_code)}`,
                {
                  params: { accessToken },
                  headers: accessToken
                    ? { Authorization: `Bearer ${accessToken}` }
                    : undefined,
                }
              );

              return {
                sku: response.data?.sku ?? product.product_code,
                quantity: Number(response.data?.quantity ?? 0),
              };
            } catch {
              return {
                sku: product.product_code,
                quantity: 0,
              };
            }
          })
        );

        const quantityBySku = new Map(
          inventoryRows.map((row) => [row.sku, row.quantity])
        );

        const totalInventoryUnits = products.reduce(
          (sum, product) => sum + (quantityBySku.get(product.product_code) ?? 0),
          0
        );

        const outOfStockProducts = products.filter(
          (product) => (quantityBySku.get(product.product_code) ?? 0) === 0
        ).length;

        const lowStockProducts = products.filter(
          (product) => (quantityBySku.get(product.product_code) ?? 0) > 0 && (quantityBySku.get(product.product_code) ?? 0) <= 10
        ).length;

        const inventoryValue = products.reduce((sum, product) => {
          const quantity = quantityBySku.get(product.product_code) ?? 0;
          return sum + quantity * Number(product.price || 0);
        }, 0);

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
          totalInventoryUnits,
          outOfStockProducts,
          lowStockProducts,
          inventoryValue,
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
        <StatCard title="New Products This Week" value={loading ? "..." : stats.productsCreatedThisWeek.toString()} />
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Avg Product Price" value={loading ? "..." : stats.avgProductPrice + "€"} />
        <StatCard title="Inventory Value" value={loading ? "..." : `${stats.inventoryValue.toFixed(2)}€`} />
        <StatCard title="Total Products" value={loading ? "..." : stats.totalProducts.toString()} />
        <StatCard title="Units In Inventory" value={loading ? "..." : stats.totalInventoryUnits.toString()} />
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
