import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

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

  const handleStatusUpdate = async (id, status) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/api/reports/status`, { id, status });
      setReports(reports.map(report => report._id === id ? response.data : report));
    } catch (err) {
      console.error('Error updating report status:', err.message);
    }
  };

  const handleExportToPDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Report: ${report.name}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Description: ${report.description}`, 10, 20);
    doc.text(`Total Amount: ${report.info.totalAmount}`, 10, 30);
    // Include receipts info in the PDF
    report.info.receiptsInfo.forEach((receipt, index) => {
      const yOffset = 40 + (index * 10);
      doc.text(`Receipt ${index + 1}: ${receipt.store}, ${receipt.total}, ${receipt.date.toLocaleDateString()}`, 10, yOffset);
    });
    doc.save(`${report.name}.pdf`);
  };

  const handleRequestChanges = async (id, changes) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/api/reports/request-changes`, { id, changes });
      setReports(reports.map(report => report._id === id ? response.data : report));
    } catch (err) {
      console.error('Error requesting changes:', err.message);
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
              {report.status === 'accepted' && (
                <button
                  onClick={() => handleDelete(report._id)}
                  className="absolute top-2 right-2 bg-red-700 text-red-300 rounded-full p-1 hover:bg-red-600"
                >
                  x
                </button>
              )}
              <h2 className="text-xl font-bold mb-2">{report.name}</h2>
              <p className="text-gray-700 mb-2">{report.description}</p>
              <p className="text-gray-700 mb-2">Total Amount: {report.info.totalAmount}</p>
              <p className="text-gray-700">Purchases: {report.info.purchaseNames.join(', ')}</p>
              <p className="text-gray-700">Status: {report.status}</p>
              <p className="text-gray-700">Average Amount: {report.info.averageAmount || 'N/A'}</p>
              <p className="text-gray-700">Receipt Count: {report.info.receiptCount || 'N/A'}</p>
              {report.status !== 'accepted' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(report._id, 'accepted')}
                    className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 ml-2"
                  >
                    Deny
                  </button>
                </>
              )}
              {report.status === 'accepted' && (
                <button
                  onClick={() => handleExportToPDF(report)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 ml-2"
                >
                  Export to PDF
                </button>
              )}
              {report.status !== 'accepted' && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Requested Changes:</h3>
                  <p className="text-gray-700">Current Changes:</p>
                  <textarea
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Enter requested changes..."
                    value={report.requested_changes || ''}
                    onChange={(e) => setReports(reports.map(r => r._id === report._id ? { ...r, requested_changes: e.target.value } : r))}
                  />
                  <button
                    onClick={() => handleRequestChanges(report._id, report.requested_changes)}
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-400"
                  >
                    Submit Changes
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GetReportsComponent;