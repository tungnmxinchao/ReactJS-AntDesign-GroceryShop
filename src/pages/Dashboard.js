import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const Dashboard = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'orders',
      label: <Link to="orders">Orders</Link>,
    },
    {
      key: 'users',
      label: <Link to="users">Users</Link>,
    },
    {
      key: 'invoices',
      label: <Link to="invoices">Invoices</Link>,
    },
    {
      key: 'products',
      label: <Link to="products">Products</Link>,
    },
    {
      key: 'top-selling',  // Thêm item mới cho biểu đồ
      label: <Link to="top-selling">Top Selling Categories</Link>,
    },
  ];

  const renderContent = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'orders':
        return (
          <div>
            <h2>Orders Management</h2>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2>Users Management</h2>
          </div>
        );
      case 'invoices':
        return (
          <div>
            <h2>Invoices Report</h2>
          </div>
        );
      case 'products':
        return (
          <div>
          </div>
        );
      case 'top-selling':  // Hiển thị ChartComponent khi path là 'top-selling'
        return (
          <div>
            <h2>Top Selling Categories</h2>
          </div>
        );
      default:
        return <div>Please select an option from the menu.</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={256} theme="dark">
        <Menu
          mode="inline"
          defaultSelectedKeys={['orders']}
          selectedKeys={[location.pathname.split('/').pop()]} // Keep selected menu item highlighted
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <h1>Admin Dashboard</h1>
          {renderContent()}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
