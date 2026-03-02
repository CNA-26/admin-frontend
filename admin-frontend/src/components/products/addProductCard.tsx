import { useState } from "react";
import Modal from "../modal.tsx";
import { productApi } from "../../api/productApi.ts";

const AddProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        product_name: "",
        price: "",
        category_id: 1,
        quantity: 0,
        description_text: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!formData.product_name || !formData.price) {
                setError("Product name and price are required");
                setLoading(false);
                return;
            }

            const productPayload = {
                product_name: formData.product_name,
                price: Number(formData.price),
                description_text: formData.description_text,
                category_id: Number(formData.category_id),
                quantity: Number(formData.quantity),
            };

            console.log("Sending product payload:", JSON.stringify(productPayload, null, 2));
            const response = await productApi.post("/products", productPayload);
            console.log("Created product:", response.data);

            setIsModalOpen(false);
            window.location.reload();

            // Optional: reset form
            setFormData({
                product_name: "",
                price: "",
                category_id: 1,
                quantity: 0,
                description_text: "",
            });

        } catch (err: any) {
            let errorMessage = "Failed to create product";
            
            console.error("Full error response:", err.response);
            
            // Handle Pydantic validation errors (array of errors)
            if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
                errorMessage = err.response.data.detail.map((e: any) => e.msg || e.detail || String(e)).join(", ");
            } 
            // Handle single error object with detail property
            else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } 
            // Handle other error formats
            else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
            console.error("Error creating product:", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* Add Product Card */}
            <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6 flex flex-col justify-center items-center border-2 border-dashed border-gray-300">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Product
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <h2 className="text-lg font-semibold mb-4">Add Product</h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="product_name"
                        placeholder="Product Name"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                    />

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

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                    />

                    <textarea
                        name="description_text"
                        placeholder="Description"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                    />
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Product"}
                </button>
            </Modal>
        </>
    );
};

export default AddProductCard;
