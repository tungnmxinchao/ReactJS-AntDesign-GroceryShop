import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import axios from 'axios';

const ChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ local storage

    axios.get('http://localhost:8080/GroceryShop/category/top-selling', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the data!', error);
    });
  }, []);

  const config = {
    data,
    xField: 'category_name',
    yField: 'total_quantity_sold',
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Total Quantity Sold',  // Chú thích cho cột y
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#000000',
        },
      },
    },
    meta: {
      category_name: { alias: 'Category' },
      total_quantity_sold: { alias: 'Total Quantity Sold' },
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <h4>Total Quantity Sold</h4> {/* Chú thích cho cột X */}
      <Column {...config} />
      <h4 style={{ position: 'absolute', bottom: 0, right: 0, margin: '7px 10px 10px 0' }}>Category Name</h4> {/* Chú thích cho cột Y */}
    </div>
  );
};

export default ChartComponent;
