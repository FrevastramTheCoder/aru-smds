// src/pages/DataView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function DataView() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://smds.onrender.com/api/v1/auth/geojson/security?simplify=0.0005")
      .then((res) => {
        if (res.data && res.data.features) {
          setData(res.data.features);
        } else {
          setError("No data found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((f) => f.properties)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Spatial Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "spatial_data.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spatial Data Table</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={exportToExcel}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Download Excel
      </button>

      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {data[0] &&
                Object.keys(data[0].properties).map((key) => (
                  <th
                    key={key}
                    className="border px-3 py-2 text-left text-gray-700 font-semibold"
                  >
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((f, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {Object.values(f.properties).map((val, j) => (
                  <td key={j} className="border px-3 py-2">
                    {val?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataView;
