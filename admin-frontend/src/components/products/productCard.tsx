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
    category: string | null;
}

const getCategoryName = (category: string | null): string => {
    if (!category) return "Uncategorized";
    switch (category.toLowerCase()) {
        case "plants":
            return "Plantor";
        case "flowers":
            return "Snittblommor";
        case "other":
            return "Övriga";
        default:
            return category.charAt(0).toUpperCase() + category.slice(1);
    }
};

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

const ProductCard = ({ id, name, price, stock, description_text, img, product_code, category }: ProductCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadWarning, setUploadWarning] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        product_name: name,
        price: price.replace("€", ""),
        quantity: stock,
        description_text: description_text || "",
        category: category || "plants",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const resolveImageSrc = () => {
        if (!img) return "/placeholder.jpg";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        if (img.startsWith("data:")) return img;

        const storedImage = localStorage.getItem(`product_image_${id}`);
        if (storedImage) return storedImage;

        const base = productApi.defaults.baseURL ?? "";
        if (!base) return img;

        if (img.includes("/")) {
            return `${base.replace(/\/$/, "")}/${img.replace(/^\//, "")}`;
        }

        return `${base.replace(/\/$/, "")}/uploads/products/${img}`;
    };

    const handleUploadImage = async () => {
        if (!imageFile) {
            setError("Please select an image file first");
            return;
        }

        try {
            setUploadingImage(true);
            setError(null);
            const imageData = new FormData();
            imageData.append("image", imageFile);
            const response = await productApi.post(`/products/${id}/image`, imageData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const uploadedFilename = response.data;
            setImageName(uploadedFilename);
            setError(null);
        } catch (err: any) {
            let errorMessage = "Failed to upload image";
            if (err.response?.data?.detail) {
                errorMessage = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e: any) => e.msg).join(", ")
                    : err.response.data.detail;
            }
            setError(errorMessage);
            console.error("Image upload error:", err);
        } finally {
            setUploadingImage(false);
        }
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
                category_id: getCategoryId(formData.category),
            });

            // Update stock in inventory service
            await inventoryApi.put(`/api/products/${product_code}`, {
                quantity: Number(formData.quantity),
            });

            if (imageName) {
                try {
                    const imageData = new FormData();
                    imageData.append("image", imageName);
                    await productApi.post(`/products/${id}/image`, imageData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                } catch (uploadErr) {
                    console.warn("Image association failed:", uploadErr);
                    setUploadWarning("Product updated, but image association failed.");
                }
            }

            console.log("Updated product:", id);
            if (!uploadWarning) {
                setIsModalOpen(false);
                window.location.reload();
            }
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
                        src={resolveImageSrc()}
                        alt={name}
                        className="w-85 h-85 object-cover rounded-md mb-4"
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                        }}
                    />
                    <div className="flex gap-2 mb-2">
                        <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                            {product_code}
                        </div>
                        <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                            {getCategoryName(category)}
                        </div>
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
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="plants">Plantor (Plants)</option>
                        <option value="flowers">Snittblommor (Cut Flowers)</option>
                        <option value="other">Övriga (Other)</option>
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                                onChange={handleImageChange}
                            />
                            <button
                                type="button"
                                disabled={!imageFile || uploadingImage}
                                onClick={handleUploadImage}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                            >
                                {uploadingImage ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                        {imageName && (
                            <p className="text-xs text-green-600 mt-1">✓ Image stored: {imageName}</p>
                        )}
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                {uploadWarning && (
                    <div className="text-amber-600 text-sm mt-2 p-2 bg-amber-50 rounded">
                        {uploadWarning}
                        <button
                            type="button"
                            onClick={handleUploadImage}
                            disabled={!imageFile || uploadingImage}
                            className="ml-2 text-amber-700 font-medium hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                )}
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