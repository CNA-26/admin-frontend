import { useState } from "react";
import Modal from "../modal.tsx";
import { productApi } from "../../api/productApi.ts";

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    stock: number; // for display only
    description_text: string;
    img: string;
}

const ProductCard = ({ id, name, price, stock, description_text, img }: ProductCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: name,
        price: price.replace("€", ""),
        quantity: stock,
        description_text: description_text,
        img: img,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            await productApi.put(`/products/${id}`, {
                product_name: formData.name,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                description_text: formData.description_text,
                img: formData.img,
                updated_at: new Date().toISOString(),
            });

            console.log("Updated product:", id);
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to update product", error);
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
                </div>

                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
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
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="text"
                        name="img"
                        value={formData.img}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="Image filename (e.g. rose_red.jpg)"
                    />
                    <textarea
                        name="description_text"
                        value={formData.description_text}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="Description"
                    />
                </div>

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