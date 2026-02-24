import { useEffect, useState } from "react";
import { productApi } from "../../api/productApi";
import { inventoryApi } from "../../api/inventoryApi";

interface LowStockProduct {
  name: string;
  stock: number;
  sku: string;
}

interface Product {
  id: number;
  product_name: string;
  product_code: string;
}

interface InventoryItem {
  sku: string;
  quantity: number;
}

const LowStock = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LOW_STOCK_THRESHOLD = 10; // Alert if stock <= 10

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoading(true);

        // Fetch all products
        const productsRes = await productApi.get("/products");
        const products: Product[] = productsRes.data;

        // Fetch inventory
        const inventoryRes = await inventoryApi.get("/api/products");
        const inventory: InventoryItem[] = inventoryRes.data;

        // Create inventory map by SKU
        const inventoryMap = new Map(
          inventory.map((item) => [item.sku, item.quantity])
        );

        // Find low stock products
        const low = products
          .map((product) => ({
            name: product.product_name,
            stock: inventoryMap.get(product.product_code) ?? 0,
            sku: product.product_code,
          }))
          .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
          .sort((a, b) => a.stock - b.stock);

        setLowStockProducts(low);
      } catch (err) {
        console.error("Failed to fetch low stock products:", err);
        setError("Failed to load low stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-red-600">
        Low Stock Products
      </h2>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          {lowStockProducts.length === 0 ? (
            <div className="text-gray-500 text-sm">All products well stocked</div>
          ) : (
            <ul className="space-y-2">
              {lowStockProducts.map((p) => (
                <li key={p.sku} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-red-500 font-bold">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default LowStock;
