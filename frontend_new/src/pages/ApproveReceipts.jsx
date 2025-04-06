import React from 'react';
// import './ApproveReceipts.css';

const ApproveReceipts = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Approve Receipts</h1>
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Pending Receipts for Approval</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="receipt-item bg-white shadow-md rounded-lg p-4">
          <img className="w-full h-32 object-cover mb-4" src="https://via.placeholder.com/150" alt="Sample Receipt" />
          <div className="receipt-details text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">Receipt #1</p>
            <button className="review-button bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Approve</button>
            <button className="review-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
          </div>
        </div>
        <div className="receipt-item bg-white shadow-md rounded-lg p-4">
          <img className="w-full h-32 object-cover mb-4" src="https://via.placeholder.com/150" alt="Sample Receipt" />
          <div className="receipt-details text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">Receipt #2</p>
            <button className="review-button bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Approve</button>
            <button className="review-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveReceipts; 