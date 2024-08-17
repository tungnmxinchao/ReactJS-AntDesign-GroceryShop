import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message } from 'antd';
import axios from 'axios';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [topSpenders, setTopSpenders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(pagination.current);
    fetchTopSpenders();
  }, [pagination.current]);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `http://localhost:8080/GroceryShop/users?page=${pageNumber}&size=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { content, totalElements } = response.data;

      setUsers(content);
      setFilteredUsers(content); // Initialize filteredUsers with the fetched data
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
        current: pageNumber,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSpenders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/GroceryShop/users/top-spender', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTopSpenders(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current);
  };

  const handleViewDetails = (userId) => {
    navigate(`/dashboard/users/${userId}`);
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:8080/GroceryShop/users/delete/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('User blocked successfully.');
      fetchUsers(pagination.current); // Refresh the list after blocking
    } catch (error) {
      console.error('Error blocking user:', error);
      message.error('Failed to block user.');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = users.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const columns = [
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'role',
      render: (roles) => roles.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? 'Active' : 'Blocked'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.userId)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.userId)}
          >
            Block
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search by username"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey="userId"
      />
      <h2>Top Spenders</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topSpenders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis domain={[0, 'dataMax']} tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar dataKey="totalSpent" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Users;
