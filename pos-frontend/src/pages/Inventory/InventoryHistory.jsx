import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getInventoryHistory } from "../../services/inventoryService";

function InventoryHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    try {

      setLoading(true);

      const data =
        await getInventoryHistory();

      setHistory(data);

    }
    catch (err) {

      console.log(err);

    }
    finally {

      setLoading(false);

    }

  };

  const filteredHistory =
    history.filter(item => {

      const matchesSearch =
        item.productName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : item.movementType === filter;

      return matchesSearch && matchesFilter;

    });

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

        <div>

          <h1 className="text-3xl font-bold">
            Inventory History
          </h1>

          <p className="text-gray-500">
            View all inventory movements and stock activity
          </p>

        </div>

        {/* Filters */}

        <div className="bg-white rounded-xl shadow p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="border rounded-lg p-3"
            />

            <select
              value={filter}
              onChange={(e)=>setFilter(e.target.value)}
              className="border rounded-lg p-3"
            >

              <option value="All">
                All Movements
              </option>

              <option value="Increase">
                Stock Refill
              </option>

              <option value="Sale">
                Sale
              </option>

              <option value="Sale Reversal">
                Sale Reversal
              </option>

            </select>

          </div>

        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    Product
                  </th>

                  <th className="text-left p-4">
                    Movement
                  </th>

                  <th className="text-left p-4">
                    Before
                  </th>

                  <th className="text-left p-4">
                    Changed
                  </th>

                  <th className="text-left p-4">
                    After
                  </th>

                  <th className="text-left p-4">
                    Performed By
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredHistory.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500"
                    >
                      No Inventory History Found
                    </td>

                  </tr>

                ) : (

                  filteredHistory.map(item => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {item.productName}
                      </td>

                      <td className="p-4">

                        {item.movementType === "Increase" && (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            Stock Refill
                          </span>

                        )}

                        {item.movementType === "Sale" && (

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            Sale
                          </span>

                        )}

                        {item.movementType === "Sale Reversal" && (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            Sale Reversal
                          </span>

                        )}

                      </td>

                      <td className="p-4">
                        {item.quantityBefore}
                      </td>

                      <td className="p-4 font-semibold">
                        {item.quantityChanged}
                      </td>

                      <td className="p-4">
                        {item.quantityAfter}
                      </td>

                      <td className="p-4">
                        {item.performedBy}
                      </td>

                      <td className="p-4">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default InventoryHistory;    