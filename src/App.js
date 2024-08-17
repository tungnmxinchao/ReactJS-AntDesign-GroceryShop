import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import FormInforProduct from './pages/FormInforProduct';
import AddProduct from './pages/AddProduct'; 
import UserDetails from './pages/UserDetails'; 
import ChartComponent from './pages/ChartComponent';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import UserTrackingOrder from './pages/UserTrackingOrder';
import UserViewDetailsOrder from './pages/UserViewDetailsOrder';


const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userTracking" element={<UserTrackingOrder />} />
          <Route path="/userViewOrder/:orderId" element={<UserViewDetailsOrder />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route path="orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="orders/:orderId" element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="invoices" element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            } />
            <Route path="products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="formInfor/:productId" element={
              <ProtectedRoute>
                <FormInforProduct />
              </ProtectedRoute>
            } />
            <Route path="addProduct" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="users/:userId" element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            } />
            <Route path="top-selling" element={
              <ProtectedRoute>
                <ChartComponent />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
