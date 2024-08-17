import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode correctly

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/GroceryShop/auth/log-in', values);
      console.log('Login response:', response.data);

      if (response.status === 200) {
        const token = response.data.result.token;
        const decodedToken = jwtDecode(token); // Decode the JWT token

        // Extract user info from decoded token
        const userInfo = {
          idUser: decodedToken.idUser, // Store the user ID
          sub: decodedToken.sub,
          scope: decodedToken.scope,
        };

        // Store token and user info in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));

        message.success('Login successful!');
        navigate('/home'); // Redirect to the home page
      } else {
        message.error('Login failed, please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" style={{ width: '100%' }}>
              Forgot Password?
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;