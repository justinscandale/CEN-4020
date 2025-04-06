import React from 'react';

const GetReports = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Get Reports</h1>
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Available Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="report-item bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-medium text-gray-800 mb-2">Report #1</p>
          <button className="download-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Download</button>
        </div>
        <div className="report-item bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-medium text-gray-800 mb-2">Report #2</p>
          <button className="download-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Download</button>
        </div>
      </div>
    </div>
  );
};

export default GetReports; 