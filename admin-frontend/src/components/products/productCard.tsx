import { useState } from "react";
import Modal from "../modal.tsx";

interface ProductCardProps {
    name: string;
    price: string;
    stock: number;
}

const ProductCard = ({ name, price, stock }: ProductCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                {/* Example form (not functional yet) */}
                <div className="space-y-3">
                    <input
                        type="text"
                        defaultValue={name}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="text"
                        defaultValue={price}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="number"
                        defaultValue={stock}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <button className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition">
                    Save Changes
                </button>
            </Modal>
        </>
    );
};

export default ProductCard;
