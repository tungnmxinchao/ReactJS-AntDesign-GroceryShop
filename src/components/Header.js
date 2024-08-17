import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.scope === 'ADMIN';
  const isUser = !!user && !isAdmin; 

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleProductsClick = () => {
    navigate('/product');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleTrackingOrderClick = () => {
    navigate('/userTracking');
  };

  const handleLogout = () => {
 
    localStorage.removeItem('cart');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  return (
    <Header style={{ backgroundColor: '#2c3e50', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#ecf0f1' }}>
        Grocery Shop
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{ lineHeight: '64px', backgroundColor: '#2c3e50', borderBottom: 'none', flex: 1 }}
        items={[
          {
            key: 'home',
            label: 'Home',
            onClick: handleHomeClick,
          },
          {
            key: 'products',
            label: 'Products',
            onClick: handleProductsClick,
          },
          {
            key: 'cart',
            label: 'Cart',
            onClick: handleCartClick,
          },
          isUser && {
            key: 'trackingOrder',
            label: 'Tracking Order',
            onClick: handleTrackingOrderClick,
          },
          isAdmin && {
            key: 'dashboard',
            label: 'Dashboard',
            onClick: handleDashboardClick,
          },
        ].filter(Boolean)} 
      />
      {!user ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="primary" style={{ marginLeft: 'auto' }} onClick={handleLoginClick}>
            Login
          </Button>
          <Button type="default" style={{ marginLeft: '10px' }} onClick={handleRegisterClick}>
            Register
          </Button>
        </div>
      ) : (
        <Button type="link" style={{ marginLeft: 'auto' }} onClick={handleLogout}>
          Logout
        </Button>
      )}
    </Header>
  );
};

export default AppHeader;
