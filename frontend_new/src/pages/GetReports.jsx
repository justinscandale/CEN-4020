import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetReportsComponent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/reports`);
        setReports(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      await axios.delete(`${baseUrl}/api/reports/${id}`);
      setReports(reports.filter(report => report._id !== id));
    } catch (err) {
      console.error('Error deleting report:', err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Reports</h1>
      <div className="max-w-lg mx-auto grid grid-cols-1 gap-6">
        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white shadow-md rounded-lg p-6 relative">
              <button
                onClick={() => handleDelete(report._id)}
                className="absolute top-2 right-2 bg-red-700 text-red-300 rounded-full p-1 hover:bg-red-600"
              >
               x
              </button>
              <h2 className="text-xl font-bold mb-2">{report.name}</h2>
              <p className="text-gray-700 mb-2">{report.description}</p>
              <p className="text-gray-700 mb-2">Total Amount: {report.info.totalAmount}</p>
              <p className="text-gray-700">Purchases: {report.info.purchaseNames.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GetReportsComponent; 