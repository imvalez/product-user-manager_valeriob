import React from 'react';
import ProductList from '../components/products/ProductList';
import './Pages.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <ProductList />
    </div>
  );
};

export default ProductsPage;