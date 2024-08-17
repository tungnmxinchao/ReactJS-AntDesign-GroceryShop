import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Typography, Spin, Divider, InputNumber } from 'antd';
import axios from 'axios';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { productId } = useParams(); // Get productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // State for selected quantity
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = () => {
    axios.get(`http://localhost:8080/GroceryShop/product/id/${productId}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  };

  const addToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const userId = userInfo?.idUser;

    let cart = JSON.parse(localStorage.getItem('cart'));

    if (!userId) {
      navigate('/login');
      return;
    }

    if (!cart) {
      cart = { userId, orderDetails: [] };
    }

    const existingProduct = cart.orderDetails.find(item => item.productId === product.productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.orderDetails.push({
        productId: product.productId,
        quantity: quantity,
        price: product.price, // Store the price in the cart
        image: product.image // Store the image in the cart
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(1);
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <Row gutter={[32, 32]} style={{ marginTop: '20px' }}>
      <Col span={10}>
        <Card
          cover={<img alt={product.name} src={product.image} style={{ height: '400px', objectFit: 'cover' }} />}
          bordered={false}
        />
      </Col>
      <Col span={14}>
        <Title level={2}>{product.name}</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>Category: {product.category.categoryName}</Text>
        <Divider />
        <Title level={3} style={{ color: '#1890ff' }}>${product.price.toFixed(2)}</Title>
        <Text type="secondary">{product.description}</Text>
        <Divider />
        <Row>
          <Col span={6}>
            <Text>Quantity: </Text>
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
          </Col>
        </Row>
        <Divider />
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          size="large"
          onClick={addToCart}
        >
          Add to Cart
        </Button>
        <Button
          type="default"
          size="large"
          style={{ marginLeft: '16px' }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Col>
    </Row>
  );
};

export default ProductDetails;