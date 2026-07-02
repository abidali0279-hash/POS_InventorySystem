import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getSales } from "../../services/saleService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

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

  const exportExcel = () => {

    const data = sales.map(sale => ({

      Invoice: sale.invoiceNumber,

      Cashier: sale.cashierName,

      Amount: sale.totalAmount,

      Status: sale.status,

      Date: new Date(
        sale.createdAt
      ).toLocaleString()

    }));

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sales Report"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

    saveAs(
      new Blob([excelBuffer]),
      "SalesReport.xlsx"
    );

  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Sales Report",
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
        "Invoice",
        "Cashier",
        "Amount",
        "Status",
        "Date"
      ]],

      body: sales.map(sale => [

        sale.invoiceNumber,

        sale.cashierName,

        `Rs ${sale.totalAmount}`,

        sale.status,

        new Date(
          sale.createdAt
        ).toLocaleString()

      ])

    });

    doc.save("SalesReport.pdf");

  };

  const completedSales =
    sales.filter(
      x => x.status === "Completed"
    );

  const reversedSales =
    sales.filter(
      x => x.status === "Reversed"
    );

  const totalRevenue =
    completedSales.reduce(
      (sum, sale) =>
        sum + sale.totalAmount,
      0
    );

  const chartData = {

    labels: completedSales.map(sale =>
      new Date(
        sale.createdAt
      ).toLocaleDateString()
    ),

    datasets: [

      {

        label: "Revenue",

        data: completedSales.map(
          sale => sale.totalAmount
        ),

        borderColor: "#2563eb",

        backgroundColor: "#2563eb"

      }

    ]

  };

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
              Reports
            </h1>

            <p className="text-gray-500">
              Sales analytics and business reports
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow"
            >
              Export Excel
            </button>

            <button
              onClick={exportPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow"
            >
              Export PDF
            </button>

          </div>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">

            <h4 className="text-gray-500">
              Total Sales
            </h4>

            <h1 className="text-4xl font-bold mt-3">
              {sales.length}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h4 className="text-gray-500">
              Revenue
            </h4>

            <h1 className="text-4xl font-bold mt-3 text-green-600">
              Rs {totalRevenue.toLocaleString()}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h4 className="text-gray-500">
              Completed
            </h4>

            <h1 className="text-4xl font-bold mt-3 text-blue-600">
              {completedSales.length}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h4 className="text-gray-500">
              Reversed
            </h4>

            <h1 className="text-4xl font-bold mt-3 text-red-600">
              {reversedSales.length}
            </h1>

          </div>

        </div>

        {/* Revenue Chart */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-6">
            Revenue Trend
          </h2>

          <Line data={chartData} />

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

                  <th className="text-left p-4">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {sales.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No Sales Found
                    </td>

                  </tr>

                ) : (

                  sales
                    .slice(0, 10)
                    .map(sale => (

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

export default Reports;