import { useState } from "react";
import Modal from "../modal.tsx";
import { productApi } from "../../api/productApi.ts";
import { inventoryApi } from "../../api/inventoryApi.ts";

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    stock: number; // for display only
    description_text: string;
    img: string;
    product_code: string;
}

const ProductCard = ({ id, name, price, stock, description_text, product_code }: ProductCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        product_name: name,
        price: price.replace("€", ""),
        quantity: stock,
        description_text: description_text || "",
        category_id: 1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            // Update product in product service
            await productApi.put(`/products/${id}`, {
                product_name: formData.product_name,
                price: Number(formData.price),
                description_text: formData.description_text,
                category_id: Number(formData.category_id),
            });

            // Update stock in inventory service
            await inventoryApi.put(`/api/products/${product_code}`, {
                quantity: Number(formData.quantity),
            });

            console.log("Updated product:", id);
            setIsModalOpen(false);
            window.location.reload();
        } catch (err: any) {
            let errorMessage = "Failed to update product";
            
            if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
                errorMessage = err.response.data.detail.map((e: any) => e.msg || e.detail || String(e)).join(", ");
            } 
            else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } 
            else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
            console.error("Failed to update product", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        try {
            setLoading(true);
            await productApi.delete(`/products/${id}`);
            window.location.reload();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to delete product", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6 flex flex-col justify-between">
                <div>
                    <img
                        src={`/placeholder.jpg`}
                        alt={name}
                        className="w-85 h-85 object-cover rounded-md mb-4"
                    />
                    <div className="inline-flex items-center px-2 py-1 mb-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                        SKU: {product_code}
                    </div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Price: {price}</p>
                    <p className="text-gray-500 text-sm">
                        Stock:{" "}
                        <span
                            className={`font-medium ${stock > 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {stock > 0 ? `${stock} available` : "Out of stock"}
                        </span>
                    </p>
                    {description_text && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                            {description_text}
                        </p>
                    )}
                </div>

                <button
                    className="mt-4 bg-[#8c7a64] hover:bg-[#7a6a54] text-white text-sm font-medium py-2 px-4 rounded-md transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    Edit
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                        <option value={1}>Plantor (Plants)</option>
                        <option value={2}>Snittblommor (Cut Flowers)</option>
                        <option value={3}>Övriga (Other)</option>
                    </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description_text"
                        value={formData.description_text}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="Description"
                    />
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProductCard;