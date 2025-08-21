import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import "../App.css";

function DataView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const layerName = "security";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch data from API
  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://smds.onrender.com/api/v1/auth/data/${layerName}?page=${pageNumber}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        const rows = res.data.data.map((r) => ({
          id: r.id,
          attributes: r.attributes,
          geometry: r.geometry,
        }));
        setData(rows);
        setFilteredData(rows);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const executeQuery = () => {
    setLoading(true);
    const result =
      searchTerm.toLowerCase() === "all data"
        ? data
        : data.filter((f) =>
            Object.values(f.attributes).some((val) =>
              val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
    setFilteredData(result);
    setLoading(false);
    toast.success(`Query run successfully. Rows found: ${result.length}`);
  };

  const handleViewMap = () => {
    // Save filteredData to localStorage for persistence
    localStorage.setItem("filteredData", JSON.stringify(filteredData));
    navigate("/mapview");
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Data View</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="Query data here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring focus:ring-blue-300 text-sm"
        />
        <button
          onClick={executeQuery}
          className="rounded bg-green-600 text-white py-2 px-4 font-semibold hover:bg-green-700 transition text-sm"
        >
          Search
        </button>
        <button
          onClick={handleViewMap}
          className="rounded bg-yellow-600 text-white py-2 px-4 font-semibold hover:bg-yellow-700 transition text-sm"
        >
          View Map
        </button>
      </div>

      {/* Table and pagination omitted for brevity */}
    </div>
  );
}

export default DataView;
