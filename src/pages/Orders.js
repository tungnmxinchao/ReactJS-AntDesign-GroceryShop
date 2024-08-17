import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Orders = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchOrders(token, pagination.current, pagination.pageSize);
    fetchOrderStatusData(token);
  }, [pagination.current]);

  const fetchOrders = (token, pageNumber, pageSize) => {
    axios.get(`http://localhost:8080/GroceryShop/order?page=${pageNumber}&size=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const { content, totalElements } = response.data;
      const ordersWithKeys = content.map(order => ({ ...order, key: order.orderId }));
      setOrders(ordersWithKeys);
      setFilteredOrders(ordersWithKeys); // Set initial filtered orders
      setPagination(prev => ({ ...prev, total: totalElements }));
    })
    .catch(error => console.error('Error fetching orders:', error));
  };

  const fetchOrderStatusData = (token) => {
    axios.get('http://localhost:8080/GroceryShop/order/all-status-counts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const transformedData = response.data.map(item => ({
        name: item.status === 1 ? 'Process' : item.status === 2 ? 'Done' : 'Failed',
        value: item.count,
        key: item.status
      }));
      setOrderStatusData(transformedData);
    })
    .catch(error => console.error('Error fetching order status data:', error));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      const filtered = orders.filter(order =>
        order.user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Username', dataIndex: ['user', 'username'], key: 'username' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 1) return 'Process';
        if (status === 2) return 'Done';
        if (status === 3) return 'Failed';
        return 'Unknown'; // Fallback for any unexpected status value
      },
    },
    { title: 'Total', dataIndex: 'total', key: 'total' },
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
      <Search
        placeholder="Search by username"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredOrders}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <h3>Order Status Distribution</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={orderStatusData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
        >
          {orderStatusData.map((entry) => (
            <Cell key={entry.key} fill={entry.name === 'Process' ? '#00C49F' : entry.name === 'Done' ? '#FF8042' : '#FF6347'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Orders;
