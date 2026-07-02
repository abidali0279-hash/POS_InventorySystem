import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    branchId: 1,
    categoryId: "",
    name: "",
    sku: "",
    barcode: "",
    unit: "",
    priceInPKR: "",
    currentStock: "",
    reorderLevel: "",
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

useEffect(() => {
  if (!message) return;
  const timer = setTimeout(() => {
    setMessage("");
  }, 3000);
  return () => clearTimeout(timer);
}, [message]);

useEffect(() => {
  const close = (e) => {
    if (e.key === "Escape") {
      setShowModal(false);
    }
  };
  window.addEventListener("keydown", close);
  return () => {
    window.removeEventListener("keydown", close);
  };
}, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts(await getProducts());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategories(await getCategories());
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      branchId: 1,
      categoryId: "",
      name: "",
      sku: "",
      barcode: "",
      unit: "",
      priceInPKR: "",
      currentStock: "",
      reorderLevel: "",
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      branchId: 1,
      categoryId: product.categoryId,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      unit: product.unit,
      priceInPKR: product.priceInPKR,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (
        !form.name ||
        !form.categoryId ||
        !form.sku ||
        !form.unit ||
        Number(form.priceInPKR) <= 0 ||
        (!editingId && Number(form.currentStock) < 0) ||
        Number(form.reorderLevel) < 0
      ) {
        setMessage("Please fill all required fields correctly.");
        setMessageType("error");
        return;
      }

      if (editingId) {
        await updateProduct(editingId, {
          categoryId: Number(form.categoryId),
          name: form.name,
          barcode: form.barcode,
          unit: form.unit,
          priceInPKR: Number(form.priceInPKR),
          reorderLevel: Number(form.reorderLevel),
          isActive: true,
        });

        setMessage("Product updated successfully.");
      } else {
        await createProduct({
          branchId: 1,
          categoryId: Number(form.categoryId),
          name: form.name,
          sku: form.sku,
          barcode: form.barcode,
          unit: form.unit,
          priceInPKR: Number(form.priceInPKR),
          currentStock: Number(form.currentStock),
          reorderLevel: Number(form.reorderLevel),
        });

        setMessage("Product created successfully.");
      }

      setMessageType("success");
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (err) {
      console.log(err);
      setMessage("Operation failed.");
      setMessageType("error");
    }
  };

  const changeStatus = async (id) => {
  const confirmToggle = window.confirm(
    "Are you sure you want to change product status?"
  );
  if (!confirmToggle) return;

  try {
    await toggleProductStatus(id);
    setMessage("Status updated successfully.");
    setMessageType("success");
    loadProducts();
  } catch {
    setMessage("Failed to update status.");
    setMessageType("error");
  }

};

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">
            Loading Products...
          </p>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-500">
              Manage your products
            </p>
          </div>

          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            + Add Product
          </button>

        </div>

        {message && (

          <div
            className={`rounded-lg px-4 py-3 text-white ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>

        )}

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="border rounded-lg px-4 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold">
              {filteredProducts.length} Products
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-100">

                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">SKU</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Actions</th>

                </tr>

              </thead>

              <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4">{product.categoryName}</td>
                        <td className="p-4">{product.sku}</td>
                        <td className="p-4">
                          Rs {Number(product.priceInPKR).toLocaleString()}
                        </td>
                        <td className="p-4">{product.currentStock}</td>

                        <td className="p-4">
                          {product.isActive ? (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify-center">

                            <button
                              onClick={() => editProduct(product)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => changeStatus(product.id)}
                              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                            >
                              Toggle
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
            </tbody>

            </table>

          </div>

        </div>  

              {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="sku"
                placeholder="SKU"
                value={form.sku}
                onChange={handleChange}
                className="border rounded-lg p-3"
                disabled={editingId}
              />

              <input
                name="barcode"
                placeholder="Barcode"
                value={form.barcode}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="unit"
                placeholder="Unit"
                value={form.unit}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="number"
                name="priceInPKR"
                placeholder="Price"
                value={form.priceInPKR}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              {!editingId && (
                <input
                  type="number"
                  name="currentStock"
                  placeholder="Current Stock"
                  value={form.currentStock}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                />
              )}

              <input
                type="number"
                name="reorderLevel"
                placeholder="Reorder Level"
                value={form.reorderLevel}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option value="">Select Category</option>

                {categories.map(category => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                {editingId ? "Update Product" : "Save Product"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>

  </Layout>
);

}

export default Products;