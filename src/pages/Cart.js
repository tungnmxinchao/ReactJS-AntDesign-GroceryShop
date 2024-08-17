import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart.orderDetails) {
      setCartItems(cart.orderDetails);
    }
  }, []);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Row align="middle">
          <Col span={6}>
            <img src={record.image} alt={record.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
          </Col>
          <Col span={18}>
            <span style={{ marginLeft: '16px' }}>{record.name}</span>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.productId)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleRemove = (productId) => {
    console.log(`Remove item with productId: ${productId}`);
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
      cart.orderDetails = cart.orderDetails.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItems(cart.orderDetails);
    }
  };

  const handleCheckout = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    if (!cart || !cart.orderDetails.length) {
      message.warning('Your cart is empty.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      message.error('You are not logged in. Please log in to continue.');
      navigate('/login'); // Use navigate to redirect
      return;
    }

    axios.post('http://localhost:8080/GroceryShop/order', cart, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token from local storage
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        message.success('Order placed successfully!');
        localStorage.removeItem('cart'); // Clear cart after successful checkout
        setCartItems([]); // Clear cart items from UI
      })
      .catch(error => {
        console.error('Error placing order:', error);
        message.error('Failed to place order. Please try again.');
      });
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Row gutter={16} style={{ padding: '20px' }}>
      <Col span={16}>
        <Card title="Shopping Cart" bordered={false}>
          <Table
            columns={columns}
            dataSource={cartItems}
            pagination={false}
            rowKey="productId" // Ensure each row has a unique key
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} />
                <Table.Summary.Cell>Total:</Table.Summary.Cell>
                <Table.Summary.Cell>{`$${totalAmount.toFixed(2)}`}</Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Order Summary" bordered={false}>
          <p>Total Amount: <strong>{`$${totalAmount.toFixed(2)}`}</strong></p>
          <Button
            type="primary"
            size="large"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={handleCheckout} // Add onClick handler here
          >
            Proceed to Checkout
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;