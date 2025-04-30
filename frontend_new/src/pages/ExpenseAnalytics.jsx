import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ExpenseAnalytics = () => {
  const [chartData, setChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [approvalChartData, setApprovalChartData] = useState({});
  const [storeChartData, setStoreChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showByCount, setShowByCount] = useState(false);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/receipts/getdepartment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log('API Response:', response);

        if (!response || !response.data) {
          throw new Error("Error fetching expenses");
        }

        setReceipts(response.data);

        const expensesByCategory = response.data.reduce((acc, receipt) => {
          const category = receipt.category || 'Uncategorized';
          if (showByCount) {
            acc[category] = (acc[category] || 0) + 1;
          } else {
            acc[category] = (acc[category] || 0) + receipt.total;
          }
          return acc;
        }, {});

        const categories = Object.keys(expensesByCategory);
        const totals = Object.values(expensesByCategory);

        setChartData({
          labels: categories,
          datasets: [
            {
              label: `Expenses by Category (${showByCount ? 'Count' : 'Value'})`,
              data: totals,
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        const expensesByMonth = response.data.reduce((acc, receipt) => {
          const date = new Date(receipt.date);
          const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
          if (showByCount) {
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          } else {
            acc[monthYear] = (acc[monthYear] || 0) + receipt.total;
          }
          return acc;
        }, {});

        const sortedMonths = Object.keys(expensesByMonth).sort((a, b) => new Date(a) - new Date(b));
        const monthTotals = sortedMonths.map(month => expensesByMonth[month]);

        setBarChartData({
          labels: sortedMonths,
          datasets: [
            {
              label: `Expenses by Month (${showByCount ? 'Count' : 'Value'})`,
              data: monthTotals,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });

        const expensesByApprovalType = response.data.reduce((acc, receipt) => {
          const approvalType = receipt.approval ? 'Approved' : 'Not Approved';
          if (showByCount) {
            acc[approvalType] = (acc[approvalType] || 0) + 1;
          } else {
            acc[approvalType] = (acc[approvalType] || 0) + receipt.total;
          }
          return acc;
        }, {});

        const expensesByStore = response.data.reduce((acc, receipt) => {
          const store = receipt.store || 'Unknown';
          if (showByCount) {
            acc[store] = (acc[store] || 0) + 1;
          } else {
            acc[store] = (acc[store] || 0) + receipt.total;
          }
          return acc;
        }, {});

        setApprovalChartData({
          labels: Object.keys(expensesByApprovalType),
          datasets: [
            {
              label: `Expenses by Approval Type (${showByCount ? 'Count' : 'Value'})`,
              data: Object.values(expensesByApprovalType),
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        });

        setStoreChartData({
          labels: Object.keys(expensesByStore),
          datasets: [
            {
              label: `Expenses by Store (${showByCount ? 'Count' : 'Value'})`,
              data: Object.values(expensesByStore),
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || "Error fetching expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [showByCount]);

  const exportToCSV = () => {
    const headers = ['Date', 'Store', 'Category', 'Subcategory', 'Total', 'Approval'];
    const csvRows = [
      headers.join(','),
      ...receipts.map(receipt => [
        new Date(receipt.date).toLocaleDateString(),
        receipt.store,
        receipt.category,
        receipt.subcategory,
        receipt.total,
        receipt.approval ? 'Approved' : 'Not Approved'
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" style={{ position: 'relative', height: '400px' }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Expense Analytics</h2>
        <div className="flex items-center mb-4">
          <label className="mr-2">Show by Count</label>
          <input
            type="checkbox"
            checked={showByCount}
            onChange={() => setShowByCount(!showByCount)}
          />
        </div>
        <button onClick={exportToCSV} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Export to CSV</button>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Approval Type</h3>
        <Pie 
          data={approvalChartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            animation: {
              duration: 0 // Disable animation to see if it affects the issue
            }
          }} 
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h3>
        <Pie 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            animation: {
              duration: 0 // Disable animation to see if it affects the issue
            }
          }} 
        />
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Expenses by Month</h3>
        <Bar 
          data={barChartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            animation: {
              duration: 0 // Disable animation to see if it affects the issue
            }
          }} 
        />
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Expenses by Store</h3>
        <Bar 
          data={storeChartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            animation: {
              duration: 0 // Disable animation to see if it affects the issue
            }
          }} 
        />
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
