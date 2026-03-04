import { useState } from "react";
import Modal from "../modal.tsx";
import { productApi } from "../../api/productApi.ts";

const getCategoryId = (category: string): number => {
    switch (category.toLowerCase()) {
        case "plants":
            return 1;
        case "flowers":
            return 2;
        case "other":
            return 3;
        default:
            return 1;
    }
};

const AddProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [createdProductId, setCreatedProductId] = useState<number | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        product_name: "",
        price: "",
        category: "plants",
        quantity: "",
        description_text: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!formData.product_name || !formData.price) {
                setError("Product name and price are required");
                return;
            }

            const productPayload = {
                product_name: formData.product_name,
                price: Number(formData.price),
                description_text: formData.description_text,
                category_id: getCategoryId(formData.category),
                quantity: Number(formData.quantity),
            };

            const response = await productApi.post("/products", productPayload);

            const newProductId = response.data?.id;
            if (!newProductId) {
                throw new Error("Product ID not returned from API");
            }

            setCreatedProductId(newProductId);
            setIsModalOpen(false);
            setIsImageModalOpen(true);

        } catch (err: any) {
            let errorMessage = "Failed to create product";

            if (err.response?.data?.detail) {
                errorMessage = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e: any) => e.msg).join(", ")
                    : err.response.data.detail;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async () => {
        if (!imageFile || !createdProductId) {
            setError("Missing product ID or image file");
            return;
        }

        try {
            setUploadingImage(true);
            setError(null);

            const imageData = new FormData();
            imageData.append("image", imageFile);

            await productApi.post(
                `/products/${createdProductId}/image`,
                imageData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setIsImageModalOpen(false);
            setCreatedProductId(null);
            setImageFile(null);

            setFormData({
                product_name: "",
                price: "",
                category: "plants",
                quantity: "",
                description_text: "",
            });

            window.location.reload();

        } catch (err: any) {
            let errorMessage = "Failed to upload image";

            if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            }

            setError(errorMessage);
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <>
            <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6 flex flex-col justify-center items-center border-2 border-dashed border-gray-300">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Product
                </button>
            </div>

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
                        value={formData.product_name}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                        value={formData.price}
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="plants">Plants</option>
                        <option value="flowers">Cut Flowers</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                        value={formData.quantity}
                    />

                    <textarea
                        name="description_text"
                        placeholder="Description"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={handleChange}
                        value={formData.description_text}
                    />
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
                    style={{ backgroundColor: "#609966" }}
                >
                    {loading ? "Creating..." : "Create Product"}
                </button>
            </Modal>

            <Modal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
            >
                <h2 className="text-lg font-semibold mb-4">
                    Upload Product Image
                </h2>

                <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    onChange={handleImageChange}
                />

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                <button
                    onClick={handleUploadImage}
                    disabled={!imageFile || uploadingImage}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
                >
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                </button>
            </Modal>
        </>
    );
};

export default AddProductCard;