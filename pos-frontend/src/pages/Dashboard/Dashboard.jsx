import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

import { getProducts } from "../../services/productService";
import { getUsers } from "../../services/userService";
import { getCategories } from "../../services/categoryService";
import { getSales } from "../../services/saleService";

import { FaBox } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";

import { generateAISummary } from "../../services/aiService";

function Dashboard() {

  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        productsData,
        usersData,
        categoriesData,
        salesData
      ] = await Promise.all([
        getProducts(),
        getUsers(),
        getCategories(),
        getSales()
      ]);

      setProducts(productsData);
      setUsers(usersData);
      setCategories(categoriesData);
      setSales(salesData);

    }
    catch (error) {

      console.log("Dashboard Error:", error);

    }
    finally {

      setLoading(false);

    }
  };

  const handleGenerateSummary = async () => {

  try {

    setAiLoading(true);

    const result =
      await generateAISummary();

    const text = result.summary;

    const executive =
      text.match(
        /Executive Summary([\s\S]*?)Business Insights/i
      );

    const insights =
      text.match(
        /Business Insights([\s\S]*?)Recommendations/i
      );

    const recommendations =
      text.match(
        /Recommendations([\s\S]*)/i
      );

    setAiSummary({

      executive:
        executive
          ? executive[1].trim()
          : "",

      insights:
        insights
          ? insights[1].trim()
          : "",

      recommendations:
        recommendations
          ? recommendations[1].trim()
          : ""

    });

  }
  catch (error) {

    console.log(error);

    alert(
      "Failed to generate AI summary."
    );

  }
  finally {

    setAiLoading(false);

  }

};

  const totalRevenue = sales
  .filter(sale => sale.status === "Completed")
  .reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  const lowStockProducts = products.filter(
    p => p.currentStock <= p.reorderLevel
  );

  if (loading) {
  return (
    <Layout>
      <div className="flex justify-center items-center h-96">
        <h2 className="text-2xl font-bold">
          Loading Dashboard...
        </h2>
      </div>
    </Layout>
  );
}

  return (
  <Layout>

    <div className="space-y-6">

      {/* Welcome */}

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold">
          Welcome, {fullName}
        </h1>

        <p className="text-gray-500 mt-2">
          Logged in as
          <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
            {role}
          </span>
        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <FaBox
            className="text-blue-600 mb-3"
            size={30}
          />

          <h3 className="text-gray-500">
            Products
          </h3>

          <h1 className="text-3xl font-bold">
            {products.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <FaTags
            className="text-green-600 mb-3"
            size={30}
          />

          <h3 className="text-gray-500">
            Categories
          </h3>

          <h1 className="text-3xl font-bold">
            {categories.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <FaUsers
            className="text-purple-600 mb-3"
            size={30}
          />

          <h3 className="text-gray-500">
            Users
          </h3>

          <h1 className="text-3xl font-bold">
            {users.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <FaExclamationTriangle
            className="text-red-500 mb-3"
            size={30}
          />

          <h3 className="text-gray-500">
            Low Stock
          </h3>

          <h1 className="text-3xl font-bold">
            {lowStockProducts.length}
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <FaMoneyBillWave
            className="text-yellow-500 mb-3"
            size={30}
          />

          <h3 className="text-gray-500">
            Revenue
          </h3>

          <h1 className="text-2xl font-bold">
            Rs {totalRevenue}
          </h1>

        </div>

      </div>

      {/* AI Business Assistant */}

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <div>

              <h2 className="text-2xl font-bold">

                AI Business Assistant

              </h2>

              <p className="text-gray-500">

                Analyze your POS data using AI

              </p>

            </div>

              <button
                onClick={handleGenerateSummary}
                disabled={aiLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold transition"
              >

                {aiLoading
                  ? "Generating..."
                  : "Generate AI Summary"}

              </button>       

              <button
                onClick={() =>
                  window.location.href = "/ai-reports"
                }
                className="bg-gray-600 hover:bg-black text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                View AI Report History
              </button>
          
          </div>

          {aiLoading && (

            <div className="flex items-center gap-3">

              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

              <span>

                AI is analyzing your business...

              </span>

            </div>

          )}

          {!aiLoading && aiSummary && (

            <div className="space-y-5">

              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-5">

                <h3 className="text-xl font-bold text-blue-700 mb-2">

                  📊 Executive Summary

                </h3>

                <p className="leading-7 whitespace-pre-wrap">

                  {aiSummary.executive}

                </p>

              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-5">

                <h3 className="text-xl font-bold text-yellow-700 mb-2">

                  💡 Business Insights

                </h3>

                <p className="leading-7 whitespace-pre-wrap">

                  {aiSummary.insights}

                </p>

              </div>

              <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-5">

                <h3 className="text-xl font-bold text-green-700 mb-2">

                  ✅ Recommendations

                </h3>

                <p className="leading-7 whitespace-pre-wrap">

                  {aiSummary.recommendations}

                </p>

              </div>

            </div>

            )}

        </div>

      {/* Recent Sales */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">

          <h2 className="text-xl font-bold">
            Recent Sales
          </h2>

        </div>

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

              </tr>

            </thead>

            <tbody>

              {sales
                .slice(0, 5)
                .map(sale => (

                <tr
                  key={sale.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {sale.invoiceNumber}
                  </td>

                  <td className="p-4">
                    {sale.cashierName}
                  </td>

                  <td className="p-4">
                    Rs {sale.totalAmount}
                  </td>

                  <td className="p-4">

                    {sale.status ===
                    "Completed" ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                        Completed

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                        Reversed

                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Low Stock */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">

          <h2 className="text-xl font-bold">

            Low Stock Products

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  Stock
                </th>

                <th className="text-left p-4">
                  Reorder Level
                </th>

              </tr>

            </thead>

            <tbody>

              {lowStockProducts.map(product => (

                <tr
                  key={product.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {product.name}
                  </td>

                  <td className="p-4">

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                      {product.currentStock}

                    </span>

                  </td>

                  <td className="p-4">
                    {product.reorderLevel}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  </Layout>
);
}

export default Dashboard;