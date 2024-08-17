import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Select, Input, Spin, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts(currentPage);
  }, [currentPage, pageSize, selectedCategory]);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery) {
      setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/GroceryShop/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pageSize,
      };
      let url = 'http://localhost:8080/GroceryShop/product/public'; // Default URL for products
      if (selectedCategory) {
        url = `http://localhost:8080/GroceryShop/product/category/${selectedCategory}`; // URL for category-specific products
      }
      const response = await axios.get(url, { params });
      setProducts(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
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
      existingProduct.quantity += 1;
    } else {
      cart.orderDetails.push({
        productId: product.productId,
        quantity: 1,
        price: product.price,
        image: product.image
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const viewProductDetails = (product) => {
    navigate(`/product/${product.productId}`);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Input
        placeholder="Search by product name"
        style={{ width: 300, marginBottom: '16px' }}
        onChange={handleSearchChange}
      />
      <Select
        placeholder="Select a category"
        style={{ width: 200, marginBottom: '16px' }}
        onChange={handleCategoryChange}
        allowClear
      >
        {categories.map(category => (
          <Option key={category.categoryID} value={category.categoryID}>
            {category.categoryName}
          </Option>
        ))}
      </Select>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col key={product.productId} span={6}>
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={viewProductDetails}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalElements}
            onChange={onPageChange}
            showSizeChanger={false}
            style={{ marginTop: '16px', textAlign: 'center' }}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;
