import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, Button } from 'antd';

const UserViewDetailsOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchOrderDetails(token, orderId);
  }, [orderId]);

  const fetchOrderDetails = (token, orderId) => {
    setLoading(true);
    axios.get(`http://localhost:8080/GroceryShop/order/user/trackOrder/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setOrder(response.data);
    })
    .catch(error => console.error('Error fetching order details:', error))
    .finally(() => setLoading(false));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const columns = [
    { title: 'Order Detail ID', dataIndex: 'orderDetailId', key: 'orderDetailId' },
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: price => `$${price.toFixed(2)}` },
  ];

  const orderDetails = order.orderDetails.map(detail => ({
    key: detail.orderDetailId,
    orderDetailId: detail.orderDetailId,
    name: detail.product.name,
    quantity: detail.quantity,
    price: detail.price,
  }));

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order.orderId}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status === 1 ? 'Process' : 'Done'}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <Table
        columns={columns}
        dataSource={orderDetails}
        pagination={false}
        rowKey="orderDetailId"
      />
      <Button onClick={() => window.history.back()}>Back</Button>
    </div>
  );
};

export default UserViewDetailsOrder;
