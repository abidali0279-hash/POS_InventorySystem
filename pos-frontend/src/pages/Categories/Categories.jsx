import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getCategories,
  createCategory
} from "../../services/categoryService";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [name, setName] = useState("");

  useEffect(() => {
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

    return () =>
      window.removeEventListener("keydown", close);

  }, []);

  const loadCategories = async () => {

    try {

      setLoading(true);

      const data =
        await getCategories();

      setCategories(data);

    }
    catch (err) {

      console.log(err);

    }
    finally {

      setLoading(false);

    }

  };

  const handleAddCategory = async () => {

    if (!name.trim()) {

      setMessage("Category name is required.");
      setMessageType("error");
      return;

    }

    try {

      await createCategory({

        name,

        parentCategoryId: null

      });

      setName("");

      setShowModal(false);

      setMessage("Category added successfully.");

      setMessageType("success");

      loadCategories();

    }
    catch {

      setMessage("Failed to add category.");

      setMessageType("error");

    }

  };

  const filteredCategories =
    categories.filter(category =>
      category.name
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
              Categories
            </h1>

            <p className="text-gray-500">
              Manage product categories
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow"
          >
            + Add Category
          </button>

        </div>

        {/* Messages */}

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
            placeholder="Search category..."
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
                    Category
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.length === 0 ? (

                  <tr>

                    <td
                      colSpan="2"
                      className="text-center py-8 text-gray-500"
                    >
                      No Categories Found
                    </td>

                  </tr>

                ) : (

                  filteredCategories.map(category => (

                    <tr
                      key={category.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">

                        {category.id}

                      </td>

                      <td className="p-4 font-medium">

                        {category.name}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Modal */}

        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">

                  Add Category

                </h2>

                <button
                  onClick={()=>{
                    setShowModal(false);
                    setName("");
                  }}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>

              </div>

              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full border rounded-lg p-3"
              />

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={()=>{
                    setShowModal(false);
                    setName("");
                  }}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </Layout>

  );

}

export default Categories;