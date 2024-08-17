import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/GroceryShop/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/GroceryShop/product', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      message.success('Product added successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Failed to add product.'); // Display error message
      } else {
        message.error('Failed to add product.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Add Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          category: categories.length > 0 ? categories[0].categoryID : null,
        }}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the product name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Image URL" name="image" rules={[{ required: true, message: 'Please enter the image URL' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the product description' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the product price' }]}>
          <Input type="number" step="0.01" />
        </Form.Item>
        <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter the product stock' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]}>
          <Select>
            {categories.map((category) => (
              <Select.Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;