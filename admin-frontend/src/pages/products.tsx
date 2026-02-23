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

    return(
        <AdminLayout>
            {loading && <div className="text-center py-8">Loading products...</div>}
            {error && <div className="text-center py-8 text-red-500">{error}</div>}
            {!loading && !error && (
                <div className="grid grid-cols-4 gap-6 mb-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id}
                            name={product.product_name} 
                            price={`€${product.price.toFixed(2)}`} 
                            stock={product.stock}
                        />
                    ))}
                   <AddProductCard/>
                </div>
            )}
        </AdminLayout>
    ) 
}

export default products;
