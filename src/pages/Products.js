import React, { useState, useEffect } from 'react';
import { Table, Button, Image, message, Input } from 'antd';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import axios from 'axios';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(pagination.current);
    fetchChartData();
  }, [pagination.current]);

  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:8080/GroceryShop/product/admin?page=${pageNumber}&size=${pagination.pageSize}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const { content, totalElements } = response.data;

      setProducts(content);
      setFilteredProducts(content); // Initially set filteredProducts to all products
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
        current: pageNumber,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/GroceryShop/product/top-selling', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const transformedData = response.data.map(item => ({
        name: item.name,
        quantity: item.total_quantity_sold,
      }));
      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTableChange = (pagination) => {
    fetchProducts(pagination.current);
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:8080/GroceryShop/product/delete/${productId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const { message: successMessage } = response.data;
      message.success(successMessage);
      fetchProducts(pagination.current);
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product.');
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/dashboard/formInfor/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/dashboard/addProduct');
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);

    if (value === '') {
      setFilteredProducts(products); // Show all products if search is cleared
    }
  };

  const columns = [
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image width={50} src={image} />,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.productId)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.productId)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#ADFF2F'];

  return (
    <div>
      <h2>Product Management</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>
      <Search
        placeholder="Search products"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredProducts}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey="productId"
      />
      <h3>Top Selling Products</h3>
      <PieChart width={600} height={400}>
        <Pie
          data={chartData}
          dataKey="quantity"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Products;
