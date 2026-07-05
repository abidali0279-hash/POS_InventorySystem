import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAISummaryHistory} from "../../services/aiService";

function AIReports() {

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {

    loadReports();

  }, []);

    const loadReports = async () => {
        try {
        const data = await getAISummaryHistory();
        setReports(data);
        }
        catch (error) {
        console.log(error);
        }
    };

    const filteredReports =
    reports.filter(report =>
        report.summary
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )
    );

 return (
  <Layout>

    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            AI Reports
          </h1>

          <p className="text-gray-500">
            View previously generated AI business summaries
          </p>

        </div>

        <span className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold">

          {filteredReports.length} Reports

        </span>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5">

        <input
          type="text"
          placeholder="Search AI summaries..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Revenue
              </th>

              <th className="text-left p-4">
                Completed
              </th>

              <th className="text-left p-4">
                Reversed
              </th>

              <th className="text-center p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredReports.map(report => (

              <tr
                key={report.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  {new Date(
                    report.createdAt
                  ).toLocaleString()}

                </td>

                <td className="p-4">

                  Rs {report.revenue}

                </td>

                <td className="p-4">

                  {report.completedSales}

                </td>

                <td className="p-4">

                  {report.reversedSales}

                </td>

                <td className="p-4 text-center">

                  <button
                    onClick={() =>
                      setSelectedReport(report)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >

                    View Summary

                  </button>

                </td>

              </tr>

            ))}

            {filteredReports.length === 0 && (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-10 text-gray-500"
                >

                  No AI Reports Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Modal */}

      {selectedReport && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 max-h-[85vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">

                AI Business Summary

              </h2>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="text-red-600 font-bold text-xl"
              >

                ✕

              </button>

            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">

              <div className="bg-blue-50 rounded-xl p-4">

                <h4 className="font-semibold">

                  Revenue

                </h4>

                <p>

                  Rs {selectedReport.revenue}

                </p>

              </div>

              <div className="bg-green-50 rounded-xl p-4">

                <h4 className="font-semibold">

                  Completed Sales

                </h4>

                <p>

                  {selectedReport.completedSales}

                </p>

              </div>

              <div className="bg-red-50 rounded-xl p-4">

                <h4 className="font-semibold">

                  Reversed Sales

                </h4>

                <p>

                  {selectedReport.reversedSales}

                </p>

              </div>

            </div>

            <div className="bg-gray-50 rounded-xl border p-6 whitespace-pre-wrap leading-8">

              {selectedReport.summary}

            </div>

          </div>

        </div>

      )}

    </div>

  </Layout>
);   

}

export default AIReports;