import { Plus, Edit, Trash2 } from "lucide-react";
import {
  deleteSellerProduct,
  addSellerProduct,
  updateSellerProduct,
} from "../../services/api";

import { useState } from "react";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  oldprice?: string;
  badge: string;
  badgeColor: string;
  rating: number;
  buyers: number;
  category: string;
  stock: number;
  description?: string;
};

type Props = {
  products: Product[];
  fetchProducts: () => void;
};

export default function SellerProducts({ products, fetchProducts }: Props) {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    badge: "",
    category: "",
    badgeColor: "bg-red-500",
    rating: "",
    buyers: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteSellerProduct(id);

      fetchProducts();
      window.dispatchEvent(new Event("productsUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      badge: "",
      category: "",
      badgeColor: "bg-red-500",
      rating: "",
      buyers: "",
    });

    setImage(null);
    setEditingProduct(null);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const sellerId = localStorage.getItem("userId");

    if (!sellerId) {
      alert("Please login as a seller first");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("badge", formData.badge);
      data.append("category", formData.category);
      data.append("badgeColor", formData.badgeColor);
      data.append("rating", formData.rating);
      data.append("buyers", formData.buyers);

      data.append("seller", sellerId);

      if (image) {
        data.append("image", image);
      }

      let response;

      if (editingProduct) {
        response = await updateSellerProduct(editingProduct.id, data);
      } else {
        response = await addSellerProduct(data);
      }

      if (response?.id || response?.title) {
        await fetchProducts();
        window.dispatchEvent(new Event("productsUpdated"));
        setShowModal(false);
        resetForm();
        alert(
          editingProduct
            ? "Product updated successfully"
            : "Product added successfully",
        );
      } else {
        alert("Unable to save product. Please check the form values.");
      }
    } catch (error) {
      console.log(error);
      alert("Unable to save product. Please try again.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Products</h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white transition hover:bg-pink-600"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
          No products added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-4"
            >
              <div className="mb-4 h-48 overflow-hidden rounded-lg bg-slate-700">
                {product.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${product.image}`}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-white">
                {product.title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {product.description || "No description"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-pink-400">₹{product.price}</p>

                  <p className="text-sm text-slate-400">
                    Stock: {product.stock}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);

                      setFormData({
                        title: product.title,
                        description: product.description || "",
                        price: String(product.price),
                        stock: String(product.stock),
                        badge: product.badge,
                        category: product.category,
                        badgeColor: product.badgeColor,
                        rating: String(product.rating),
                        buyers: String(product.buyers),
                      });

                      setShowModal(true);
                    }}
                    className="rounded-lg bg-yellow-500/20 p-2 text-yellow-400 transition hover:bg-yellow-500/30"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4">
          <div className="scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-pink-500 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-slate-900 p-4 sm:p-6">
            {" "}
            <h2 className="mb-4 text-2xl font-bold text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>{" "}
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0 - 5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <input
                type="text"
                placeholder="Badge (Example: New, Sale)"
                value={formData.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    badge: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <select
                value={formData.badgeColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    badgeColor: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              >
                <option value="bg-red-500">Red</option>
                <option value="bg-pink-500">Pink</option>
                <option value="bg-cyan-500">Cyan</option>
                <option value="bg-purple-500">Purple</option>
              </select>
              <input
                type="number"
                min="0"
                placeholder="Total Buyers"
                value={formData.buyers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyers: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              />
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-500/40 bg-slate-800 p-6 text-center transition hover:border-pink-500 hover:bg-slate-700/40">
                <span className="mb-2 text-lg font-semibold text-pink-400">
                  Upload Product Image
                </span>

                <span className="text-sm text-slate-400">
                  Click to choose image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                />
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-pink-500 px-4 py-2 text-white"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
