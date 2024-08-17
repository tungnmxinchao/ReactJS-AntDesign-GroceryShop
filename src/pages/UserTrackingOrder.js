import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserTrackingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.idUser;
    if (userId) {
      fetchUserOrders(token, userId, pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchUserOrders = (token, userId, pageNumber, pageSize) => {
    setLoading(true);
    axios.get(`http://localhost:8080/GroceryShop/order/user/${userId}`, {
      params: {
        page: pageNumber,
        size: pageSize,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      const { content, totalElements } = response.data;
      const ordersWithKeys = content.map(order => ({ ...order, key: order.orderId }));
      setOrders(ordersWithKeys);
      setPagination(prev => ({ ...prev, total: totalElements }));
    })
    .catch(error => console.error('Error fetching user orders:', error))
    .finally(() => setLoading(false));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/userViewOrder/${orderId}`);
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate', render: text => new Date(text).toLocaleString() },
    { title: 'Status', dataIndex: 'status', key: 'status', render: status => (status === 1 ? 'Process' : 'Done') },
    { title: 'Total', dataIndex: 'total', key: 'total', render: total => `$${total.toFixed(2)}` },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record.orderId)}>View Details</Button>
      ),
    },
  ];

  return (
    <div>
      <h2>User Order Tracking</h2>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserTrackingOrder;
