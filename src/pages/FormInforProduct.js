import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Form, Input, Button, Select, message, Image } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FormInforProduct = () => {  
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/GroceryShop/product/id/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProduct(response.data);
        form.setFieldsValue({
          name: response.data.name,
          image: response.data.image,
          description: response.data.description,
          price: response.data.price ? parseFloat(response.data.price) : '', // Ensure price is a number
          stock: response.data.stock ? parseInt(response.data.stock, 10) : '', // Ensure stock is an integer
          category: response.data.category ? response.data.category.categoryID : '', // Ensure category ID is available
          status: response.data.status,
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
        message.error('Failed to fetch product details. Please try again.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/GroceryShop/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories.');
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [productId]);

  const handleUpdate = async (values) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:8080/GroceryShop/product/update/${productId}`, {
        name: values.name,
        image: values.image,
        description: values.description,
        price: parseFloat(values.price), // Ensure price is a number
        stock: parseInt(values.stock, 10), // Ensure stock is an integer
        categoryId: values.category,
        status: values.status,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('Product updated successfully!');
      // Optionally re-fetch product details after update to reflect changes
      const updatedProductResponse = await axios.get(`http://localhost:8080/GroceryShop/product/id/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProduct(updatedProductResponse.data); // Update the local state with the updated product
      form.setFieldsValue({
        name: updatedProductResponse.data.name,
        image: updatedProductResponse.data.image,
        description: updatedProductResponse.data.description,
        price: updatedProductResponse.data.price ? parseFloat(updatedProductResponse.data.price) : '', // Ensure price is a number
        stock: updatedProductResponse.data.stock ? parseInt(updatedProductResponse.data.stock, 10) : '', // Ensure stock is an integer
        category: updatedProductResponse.data.category ? updatedProductResponse.data.category.categoryID : '', // Ensure category ID is available
        status: updatedProductResponse.data.status,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Failed to update product.');
      } else {
        message.error('Failed to update product.');
      }
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <Card title={`Product Details - ${product.name}`} style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
      <Image src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Product ID">{product.productId}</Descriptions.Item>
        <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Price">{product.price ? `$${product.price.toFixed(2)}` : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
        <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
        <Descriptions.Item label="Category">{product.category ? product.category.categoryName : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Status">{product.status === 1 ? 'Available' : 'Unavailable'}</Descriptions.Item>
      </Descriptions>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the product name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image URL"
          rules={[{ required: true, message: 'Please input the image URL!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: 'Please input the stock quantity!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
        >
          <Select>
            <Option value={1}>Available</Option>
            <Option value={0}>Unavailable</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormInforProduct;