import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;

        const response = await axios.get(`${baseUrl}/api/receipts/get`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReceipts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching receipts");
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Receipts</h2>

        {receipts.length > 0 ? (
          <div className="space-y-6">
            {receipts.map((receipt) => (
              <div
                key={receipt._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold text-gray-900">
                      Receipt from {new Date(receipt.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {receipt._id.slice(-6)}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    <div className="space-y-2">
                      {receipt.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">
                              x{item.quantity}
                            </span>
                          </div>
                          <div className="text-gray-900">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>
                        $
                        {receipt.items
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No receipts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewReceipts;
