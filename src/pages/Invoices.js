import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Invoices = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoicesData, setInvoicesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [overallRevenue, setOverallRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0); // State mới để lưu trữ tổng lợi nhuận
  const [totalProfitByDate, setTotalProfitByDate] = useState(0); // State mới để lưu trữ tổng lợi nhuận theo ngày
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Fetch overall revenue
    axios.get('http://localhost:8080/GroceryShop/invoice/total-revenue', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setOverallRevenue(response.data);
    })
    .catch(error => console.error('Error fetching overall revenue:', error));

    // Fetch total profit
    axios.get('http://localhost:8080/GroceryShop/invoice/total-profit', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setTotalProfit(response.data);
    })
    .catch(error => console.error('Error fetching total profit:', error));
  }, []);

  const fetchData = () => {
    if (startDate && endDate) {
      const start = moment(startDate).toISOString();
      const end = moment(endDate).add(1, 'days').toISOString();

      const token = localStorage.getItem('token');
      // Fetch total revenue by date
      axios.get(`http://localhost:8080/GroceryShop/invoice/total-revenue-by-date?startDate=${start}&endDate=${end}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setTotalRevenue(response.data);
      })
      .catch(error => console.error('Error fetching total revenue:', error));

      // Fetch total profit by date
      axios.get(`http://localhost:8080/GroceryShop/invoice/total-profit-by-date?startDate=${start}&endDate=${end}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setTotalProfitByDate(response.data);
      })
      .catch(error => console.error('Error fetching total profit by date:', error));

      // Fetch invoices
      axios.get(`http://localhost:8080/GroceryShop/invoice/invoices-by-date?startDate=${start}&endDate=${end}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          setInvoicesData(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch(error => console.error('Error fetching invoices:', error));
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  const columns = [
    { title: 'Invoice ID', dataIndex: 'invoiceId', key: 'invoiceId' },
    { title: 'Customer Name', dataIndex: ['order', 'user', 'username'], key: 'customerName' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: text => `$${text.toFixed(2)}` },
    { title: 'Date', dataIndex: 'invoiceDate', key: 'date', render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3>Overall Revenue: ${overallRevenue.toFixed(2)}</h3>
        <h3>Total Profit: ${totalProfit.toFixed(2)}</h3> {/* Hiển thị tổng lợi nhuận */}
      </div>

      <div style={{ marginBottom: 16 }}>
        <RangePicker
          showTime
          format="YYYY-MM-DDTHH:mm:ss"
          onChange={(dates, dateStrings) => {
            setStartDate(dateStrings[0]);
            setEndDate(dateStrings[1]);
          }}
        />
        <Button type="primary" onClick={fetchData} style={{ marginLeft: 8 }}>
          Fetch Data
        </Button>
      </div>

      {totalRevenue !== null && (
        <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
      )}
      {totalProfitByDate !== null && (
        <h3>Total Profit by Date: ${totalProfitByDate.toFixed(2)}</h3>
      )}

      <Table dataSource={invoicesData} columns={columns} rowKey="invoiceId" />

      <Modal
  title="Invoice Details"
  open={isModalVisible} // Thay đổi từ `visible` sang `open`
  onCancel={handleModalClose}
  footer={[
    <Button key="close" onClick={handleModalClose}>
      Close
    </Button>,
  ]}
>
  {selectedInvoice && (
    <div>
      <p><strong>Invoice ID:</strong> {selectedInvoice.invoiceId}</p>
      <p><strong>Customer Name:</strong> {selectedInvoice.order.user.username}</p>
      <p><strong>Amount:</strong> ${selectedInvoice.amount.toFixed(2)}</p>
      <p><strong>Date:</strong> {moment(selectedInvoice.invoiceDate).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p><strong>Profit:</strong> ${selectedInvoice.profit.toFixed(2)}</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        {selectedInvoice.order.orderDetails.map(detail => (
          <li key={detail.orderDetailId}>
            {detail.product.name} - ${detail.price.toFixed(2)} x {detail.quantity}
          </li>
        ))}
      </ul>
    </div>
  )}
</Modal>
    </div>
  );
};

export default Invoices;
