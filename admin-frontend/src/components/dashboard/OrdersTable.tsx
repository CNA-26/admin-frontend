import { useEffect, useState } from "react";
import { wishlistApi } from "../../api/wishlistApi";
import { inventoryApi } from "../../api/inventoryApi";
import { productApi } from "../../api/productApi";

interface WishlistItem {
  sku: string;
  wishlistCount: number;
  stock: number;
  productName: string;
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

const OrdersTable = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        setLoading(true);

        // Fetch wishlist stats
        const wishlistRes = await wishlistApi.get("wishlist/stats");
        
        console.log("Wishlist response:", wishlistRes);
        console.log("Wishlist response data:", wishlistRes.data);
        console.log("Wishlist response data type:", typeof wishlistRes.data);
        
        // Check if response is actually JSON
        if (typeof wishlistRes.data !== 'object' || wishlistRes.data === null) {
          console.error("Response is not an object:", wishlistRes.data);
          throw new Error("Invalid wishlist response format");
        }

        const wishlistStats: Record<string, number> = wishlistRes.data;
        
        console.log("Wishlist stats:", wishlistStats);

        // Fetch products
        const productsRes = await productApi.get("/products");
        const products: Product[] = productsRes.data;

        // Fetch inventory
        const inventoryRes = await inventoryApi.get("/api/products");
        const inventory: InventoryItem[] = inventoryRes.data;

        // Create lookup maps
        const productMap = new Map(
          products.map((p) => [p.product_code, p.product_name])
        );
        const inventoryMap = new Map(
          inventory.map((i) => [i.sku, i.quantity])
        );

        // Combine wishlist data with inventory and product names
        const combined: WishlistItem[] = Object.entries(wishlistStats).map(
          ([sku, count]) => ({
            sku,
            wishlistCount: count,
            stock: inventoryMap.get(sku) ?? 0,
            productName: productMap.get(sku) || "Unknown Product",
          })
        );

        // Sort by wishlist count (most wishlisted first)
        combined.sort((a, b) => b.wishlistCount - a.wishlistCount);

        setWishlistItems(combined);
      } catch (err: any) {
        console.error("Failed to fetch wishlist data:", err);
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        console.error("Response headers:", err.response?.headers);
        setError("Failed to load wishlist data");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, []);

  return (
    <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Popular Wishlist Items</h2>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2">Product</th>
              <th>SKU</th>
              <th>Wishlist Count</th>
              <th>Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 text-gray-500">
                  No wishlist items yet
                </td>
              </tr>
            ) : (
              wishlistItems.map((item) => (
                <tr key={item.sku} className="border-b hover:bg-gray-50">
                  <td className="py-2">{item.productName}</td>
                  <td>{item.sku}</td>
                  <td className="font-semibold text-blue-600">{item.wishlistCount}</td>
                  <td>
                    <span
                      className={`font-semibold ${
                        item.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
