import { useState } from "react";
import Modal from "../modal.tsx";
import { productApi } from "../../api/productApi.ts";

const AddProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        product_name: "",
        price: "",
        stock: 0,
        description_text: "",
        img: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const response = await productApi.post("/products", payload);

            console.log("Created product:", response.data);
            

            setIsModalOpen(false);

            // Optional: reset form
            setFormData({
                product_name: "",
                price: "",
                stock: 0,
                description_text: "",
                img: "",
            });

        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create product");
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

                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="img"
                        placeholder="Image filename (e.g. rose_red.jpg)"
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

                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                >
                    Create Product
                </button>
            </Modal>
        </>
    );
};

export default AddProductCard;
