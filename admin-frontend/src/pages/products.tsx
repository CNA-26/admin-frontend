import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ProductCard from "../components/products/productCard";
import AddProductCard from "../components/products/addProductCard";
import { productApi } from "../api/productApi";
import { inventoryApi } from "../api/inventoryApi";

interface Product {
    id: number;
    product_name: string;
    price: number;
    product_code: string;
    description_text: string;
    img: string;
    category: string | null;
    created_at: string;
    updated_at: string;
}

interface InventoryItem {
    sku: string;
    quantity: number;
    updatedAt: string;
}

interface ProductWithStock extends Product {
    stock: number;
}

const products = () => {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "priceCheap" | "priceExpensive" | "stockLow" | "stockHigh">("name");
    const [products, setProducts] = useState<ProductWithStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsWithInventory = async () => {
            try {
                setLoading(true);

                // Fetch products
                const productsResponse = await productApi.get("/products");
                const productsData: Product[] = productsResponse.data;
                console.log("Products from API:", productsData);

                // Fetch inventory list once and index by SKU
                const inventoryResponse = await inventoryApi.get("/api/products");
                const inventoryData: InventoryItem[] = inventoryResponse.data;
                const inventoryBySku = new Map(
                    inventoryData.map((item) => [item.sku, item.quantity])
                );

                // Merge products with inventory data
                const productsWithStock: ProductWithStock[] = productsData.map(product => {
                    const stock = inventoryBySku.get(product.product_code) ?? 0;
                    return {
                        ...product,
                        stock
                    };
                });

                setProducts(productsWithStock);
            } catch (err) {
                setError("Failed to fetch products");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsWithInventory();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.product_name.toLowerCase().includes(search.toLowerCase()) ||
        product.product_code.toLowerCase().includes(search.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "priceCheap":
                return a.price - b.price;
            case "priceExpensive":
                return b.price - a.price;
            case "stockLow":
                return a.stock - b.stock;
            case "stockHigh":
                return b.stock - a.stock;
            case "name":
            default:
                return a.product_name.localeCompare(b.product_name);
        }
    })

    return (
        <AdminLayout>
            {loading && <div className="text-center py-8">Loading products...</div>}
            {error && <div className="text-center py-8 text-red-500">{error}</div>}
            {!loading && !error && (

                <><div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-67 flex justify-start mb-4 px-3 py-2 border bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border rounded-lg bg-white"
                    >
                        <option value="name">Sort by name</option>
                        <option value="priceCheap">Cheapest first</option>
                        <option value="priceExpensive">Most expensive first</option>
                        <option value="stockLow">Low stock first</option>
                        <option value="stockHigh">High stock first</option>
                    </select>
                </div>

                    <div className="grid grid-cols-4 gap-6 mb-6">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.product_name}
                                price={`€${product.price.toFixed(2)}`}
                                stock={product.stock}
                                description_text={product.description_text}
                                img={product.img}
                                product_code={product.product_code}
                                category={product.category}
                            />
                        ))}
                        <AddProductCard />
                    </div></>
            )}
        </AdminLayout>
    )
}

export default products;
