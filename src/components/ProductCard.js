import React from 'react';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons'; // Import EyeOutlined icon

const { Meta } = Card;

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <Card
      hoverable
      style={{ width: 240, borderRadius: '10px', overflow: 'hidden' }}
      cover={<img alt={product.name} src={product.image} style={{ height: '200px', objectFit: 'cover' }} />}
      actions={[
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          style={{ width: '100%' }}
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>,
        <Button
          type="default"
          icon={<EyeOutlined />}
          style={{ width: '100%' }}
          onClick={() => onViewDetails(product)}
        >
          View Details
        </Button>,
      ]}
    >
      <Meta title={product.name} description={`$${product.price.toFixed(2)}`} />
    </Card>
  );
};

export default ProductCard;