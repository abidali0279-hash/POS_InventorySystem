import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getSales,
  reverseSale
} from "../../services/saleService";

function SalesHistory() {

  const role = localStorage.getItem("role");
  const userId = Number(localStorage.getItem("userId"));

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {

    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);

  }, [message]);

  const loadSales = async () => {

    try {

      setLoading(true);

      const data = await getSales();

      setSales(data);

    }
    catch (err) {

      console.log(err);

    }
    finally {

      setLoading(false);

    }

  };

  const handleReverse = async (saleId) => {

    const ok = window.confirm(
      "Reverse this sale?"
    );

    if (!ok) return;

    try {

      await reverseSale(saleId, {
        approvedBy: userId,
        reason: "Reversed from Sales History"
      });

      setMessage("Sale reversed successfully.");

      setMessageType("success");

      loadSales();

    }
    catch {

      setMessage("Failed to reverse sale.");

      setMessageType("error");

    }

  };

  const filteredSales = sales.filter(sale => {

    const matchesSearch =
      sale.invoiceNumber
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : sale.status === statusFilter;

    return matchesSearch && matchesStatus;

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
            Sales History
          </h1>

          <p className="text-gray-500">
            View completed and reversed sales
          </p>

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

        {/* Filters */}

        <div className="bg-white rounded-xl shadow p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search Invoice..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="border rounded-lg p-3"
            />

            <select
              value={statusFilter}
              onChange={(e)=>setStatusFilter(e.target.value)}
              className="border rounded-lg p-3"
            >
              <option value="All">
                All Status
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Reversed">
                Reversed
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
                    Invoice
                  </th>

                  <th className="text-left p-4">
                    Cashier
                  </th>

                  <th className="text-left p-4">
                    Amount
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-center p-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredSales.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >
                      No Sales Found
                    </td>

                  </tr>

                ) : (

                  filteredSales.map(sale => (

                    <tr
                      key={sale.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">

                        {sale.invoiceNumber}

                      </td>

                      <td className="p-4">

                        {sale.cashierName}

                      </td>

                      <td className="p-4">

                        Rs {sale.totalAmount.toLocaleString()}

                      </td>

                      <td className="p-4">

                        {sale.status === "Completed" ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                            Completed

                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                            Reversed

                          </span>

                        )}

                      </td>

                      <td className="p-4">

                        {new Date(
                          sale.createdAt
                        ).toLocaleString()}

                      </td>

                      <td className="p-4">

                        {(role === "Admin" || role === "Manager") &&
                        sale.status === "Completed" ? (

                          <button
                            onClick={() => handleReverse(sale.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            Reverse
                          </button>

                        ) : (

                          <span className="text-gray-400">
                            —
                          </span>

                        )}

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

export default SalesHistory;