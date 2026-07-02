import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getProducts } from "../../services/productService";
import { adjustStock } from "../../services/inventoryService";

function Inventory() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadProducts();
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

    return () =>
      window.removeEventListener("keydown", close);

  }, []);

  const loadProducts = async () => {

    try {

      setLoading(true);

      const data = await getProducts();

      setProducts(data);

    }
    catch (err) {

      console.log(err);

    }
    finally {

      setLoading(false);

    }

  };

  const openAddStock = (product) => {

    setSelectedProduct(product);

    setQuantity("");

    setReason("");

    setShowModal(true);

  };

  const handleAddStock = async () => {

    if (!quantity || Number(quantity) <= 0) {

      setMessage("Enter a valid quantity.");

      setMessageType("error");

      return;

    }

    try {

      await adjustStock({

        productId: selectedProduct.id,

        quantity: Number(quantity),

        adjustmentType: "Increase",

        reason,

        userId: Number(localStorage.getItem("userId"))

      });

      setMessage("Stock updated successfully.");

      setMessageType("success");

      setShowModal(false);

      setSelectedProduct(null);

      loadProducts();

    }
    catch {

      setMessage("Failed to update stock.");

      setMessageType("error");

    }

  };

  const filteredProducts = products.filter(product =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Inventory
            </h1>

            <p className="text-gray-500">
              Manage inventory and stock
            </p>

          </div>

        </div>

        {/* Alert */}

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

        {/* Search */}

        <div className="bg-white rounded-xl shadow p-5">

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Product
                  </th>

                  <th className="text-left p-4">
                    Stock
                  </th>

                  <th className="text-left p-4">
                    Reorder Level
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-center p-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500"
                    >
                      No Products Found
                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(product => (

                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {product.id}
                      </td>

                      <td className="p-4 font-medium">
                        {product.name}
                      </td>

                      <td className="p-4">
                        {product.currentStock}
                      </td>

                      <td className="p-4">
                        {product.reorderLevel}
                      </td>

                      <td className="p-4">

                        {product.currentStock <= product.reorderLevel ? (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            Low Stock
                          </span>

                        ) : (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            Normal
                          </span>

                        )}

                      </td>

                      <td className="p-4">

                        <div className="flex justify-center">

                          <button
                            onClick={() => openAddStock(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                          >
                            Add Stock
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

        {/* Modal */}

        {showModal && selectedProduct && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                  Add Stock
                </h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>

              </div>

              <div className="space-y-4">

                <input
                  value={selectedProduct.name}
                  disabled
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e)=>setQuantity(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <textarea
                  rows="4"
                  placeholder="Reason"
                  value={reason}
                  onChange={(e)=>setReason(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={()=>{
                    setShowModal(false);
                    setSelectedProduct(null);
                  }}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddStock}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Save Stock
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default Inventory;