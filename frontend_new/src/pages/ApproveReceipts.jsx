import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, X } from "lucide-react";

//protect through middleware
const ApproveReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

//event handler for approve click
const approveClick = async (id) => {
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const res = await axios.post(`${baseUrl}/api/receipts/approve`, 
      { id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.message) {
      alert(res.data.message);
      setReceipts((prevReceipts) =>
        prevReceipts.map((receipt) =>
          receipt._id === id ? { ...receipt, approval: true } : receipt
        )
      );
    }
  } catch (error) {
    alert('Error approving receipt');
  }
};

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/receipts/getdepartment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        if(!response || !response.data)
        {
          throw new error("error on fetch department receipts");
        }
        setReceipts(response.data);
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
              <XCircle className="h-5 w-5 text-red-400" />
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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Receipts</h2>

        {receipts.length > 0 ? ( 
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {receipts.map((receipt) => (
              <div
                key={receipt._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                {/* Receipt Image (Clickable to Open Modal) */}
                <div className="relative">
                  <img
                    src={receipt.image}
                    alt="Receipt"
                    className="w-full h-40 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(receipt.image)}
                  />
                  <div className="absolute top-2 right-2">
                    {receipt.approval ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                        <XCircle className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="absolute top-10 right-2 flex flex-col">
                    {receipt.approval ? (
                      <></>
                    ) : (
                      <>
                        <button onClick={() => approveClick(receipt._id)} className="inline-flex items-center px-2 py-1 text-xs font-medium text-white-900 bg-green-100 rounded-full">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button onClick={() => alert('Delete receipt Functionality')} className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-900 bg-red-100 rounded-full mt-2">
                          <XCircle className="w-4 h-4 mr-1" />
                          Deny
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Receipt Details */}
                <div className="p-5">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {receipt.store}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(receipt.date).toLocaleDateString()}
                  </div>

                  {/* Category & Subcategory */}
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                      {receipt.category}
                    </span>
                    {receipt.subcategory && (
                      <span className="ml-2 inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                        {receipt.subcategory}
                      </span>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {receipt.items.map((item) => (
                        <li
                          key={item._id}
                          className="flex justify-between py-2"
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
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total Amount */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${receipt.total ? receipt.total.toFixed(2) : 0.00}</span>
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

      {/* Modal for Full-Size Image View */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl">
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            {console.log(selectedImage)}
            <img
              src={selectedImage}
              alt="Full Receipt"
              className="max-h-screen w-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveReceipts; 