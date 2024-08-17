import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Spin, message, Typography, Radio, Button } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const UserDetails = () => {
  const { userId } = useParams(); // Extract userId from URL parameters
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // Track status selection
  const [updating, setUpdating] = useState(false); // Track updating state

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8080/GroceryShop/users/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setUser(response.data);
      setStatus(response.data.status); // Set initial status
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async () => {
    setUpdating(true);
    const token = localStorage.getItem('token');
    const apiUrl =
      status === 1
        ? `http://localhost:8080/GroceryShop/users/activeUser/${userId}`
        : `http://localhost:8080/GroceryShop/users/delete/${userId}`;

    try {
      await axios.put(apiUrl, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success(`User status updated to ${status === 1 ? 'Active' : 'Blocked'}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Failed to update user status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>User Details</Title>
        {user ? (
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="User ID">{user.userId}</Descriptions.Item>
            <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.roles.join(', ')}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Radio.Group
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <Radio value={1} style={{ color: 'green' }}>Active</Radio>
                <Radio value={0} style={{ color: 'red' }}>Blocked</Radio>
              </Radio.Group>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No user details found.</p>
        )}
        <Button
          type="primary"
          onClick={updateUserStatus}
          loading={updating}
          style={{ marginTop: '20px' }}
        >
          Update Status
        </Button>
      </Card>
    </div>
  );
};

export default UserDetails;