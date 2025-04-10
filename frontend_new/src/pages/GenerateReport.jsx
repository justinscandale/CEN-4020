import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const GenerateReport = async (reportData) => {
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const response = await axios.post(`${baseUrl}/api/reports`, reportData);
    console.log('Report created successfully:', response.data);
  } catch (error) {
    console.error('Error creating report:', error.response ? error.response.data : error.message);
  }
};

const GenerateReportComponent = () => {
  const [reportName, setReportName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenseType, setExpenseType] = useState([]);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reportData = {
      name: reportName,
      description: description,
      startDate: startDate,
      endDate: endDate,
      expenseType: expenseType,
      }

    await GenerateReport(reportData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Generate Report</h1>
      <form className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportName">
            Report Name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="reportName" type="text" placeholder="Enter report name" value={reportName} onChange={(e) => setReportName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
            Start Date
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            End Date (Optional)
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expenseType">
            Expense Type
          </label>
          <select multiple className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="expenseType" value={expenseType} onChange={(e) => setExpenseType(Array.from(e.target.selectedOptions, option => option.value))}>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="accommodation">Accommodation</option>
            <option value="supplies">Supplies</option>
          </select>
        </div>
        <button onClick={()=>handleSubmit()} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Generate
        </button>
      </form>
    </div>
  );
};

export default GenerateReportComponent; 