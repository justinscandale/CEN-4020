import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    description: '',
    frequency: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/recurring-expenses`);
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Error fetching expenses');
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      console.log(newExpense); // Log the data being sent
      const response = await axios.post(`${baseUrl}/api/recurring-expenses`, newExpense);
      setExpenses([...expenses, response.data]);
      setNewExpense({ name: '', description: '', frequency: '' });
    } catch (err) {
      console.error('Error adding expense:', err);
      // Removed setError for adding expense
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      console.log(`Deleting expense with ID: ${id}`);
      await axios.delete(`${baseUrl}/api/recurring-expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Error deleting expense');
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.put(`${baseUrl}/api/recurring-expenses/${id}/pay`);
      setExpenses(expenses.map(expense => expense._id === id ? response.data : expense));
      alert('Expense payment request submitted to finance team.');
    } catch (err) {
      console.error('Error marking expense as paid:', err);
      setError('Error marking expense as paid');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Recurring Expenses</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
          <input
            type="text"
            name="name"
            value={newExpense.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            name="frequency"
            value={newExpense.frequency}
            onChange={handleInputChange}
            placeholder="Frequency"
            className="border p-2 mb-2 w-full rounded"
          />
          <button onClick={handleAddExpense} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Expense
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Existing Expenses</h2>
          {expenses.length === 0 ? (
            <p>No recurring expenses available.</p>
          ) : (
            <ul className="space-y-4">
              {expenses.map((expense) => (
                <li key={expense._id} className="mb-2 p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="text-lg font-semibold">{expense.name}</p>
                  <p>{expense.description}</p>
                  <p>Frequency: {expense.frequency}</p>
                  <p>Last Paid: {new Date(expense.lastPaid).toLocaleDateString()}</p>
                  <button onClick={() => handleDeleteExpense(expense._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2">
                    Delete
                  </button>
                  <button onClick={() => handleMarkAsPaid(expense._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Mark as Paid
      </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringExpenses;
