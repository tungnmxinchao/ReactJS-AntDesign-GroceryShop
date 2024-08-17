import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonsVisible, setButtonsVisible] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (orderId) {
      axios.get(`http://localhost:8080/GroceryShop/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('API Response:', response.data); 
        setOrder(response.data);
        setLoading(false);
        if (response.data.status === 1) {
          setButtonsVisible(true); // Show the buttons only if the status is 1 (Process)
        }
      })
      .catch(error => {
        console.error('Error fetching order details:', error);
        setLoading(false);
      });
    }
  }, [orderId]);

  const handleUpdateStatus = (status) => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:8080/GroceryShop/order/update/${orderId}?status=${status}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Order status updated:', response.data);
      setButtonsVisible(false); // Hide the buttons after successful update
    })
    .catch(error => {
      console.error('Error updating order status:', error);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order.orderId}</p>
      <p><strong>Order Date:</strong> {order.orderDate}</p>
      <p><strong>Status:</strong> {order.status === 1 ? 'Process' : order.status === 2 ? 'Done' : 'Failed'}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <h3>Order Items:</h3>
      <ul>
        {order.orderDetails.map(detail => (
          <li key={detail.orderDetailId}>
            <p><strong>Order Detail ID:</strong> {detail.orderDetailId}</p>
            <p><strong>Product Name:</strong> {detail.product.name}</p>
            <p><strong>Quantity:</strong> {detail.quantity}</p>
            <p><strong>Price:</strong> ${detail.price}</p>
          </li>
        ))}
      </ul>

      {buttonsVisible && (
        <div>
          <button onClick={() => handleUpdateStatus(2)}>Done</button>
          <button onClick={() => handleUpdateStatus(3)}>Failed</button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
