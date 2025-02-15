import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch receipts when the component is mounted
    const fetchReceipts = async () => {
      try {
        // Sending the token for authorization
        const response = await axios.get('/api/receipts/get', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Token from localStorage
          }
        });
        setReceipts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching receipts');
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Your Receipts</h2>
      <ul>
        {receipts.length > 0 ? (
          receipts.map(receipt => (
            <li key={receipt._id}>
              <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
              
              <h4>Items:</h4>
              <ul>
                {receipt.items.map((item, index) => (
                  <li key={index}>
                    <strong>{item.name}</strong> - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No receipts found</p>
        )}
      </ul>
    </div>
  );
};

export default ReviewReceipts;
