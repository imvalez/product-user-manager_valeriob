import React from 'react';
import ProductForm from '../components/products/ProductForm';
import { createProductApi } from '../utils/api';
import './Pages.css';

const ProductCreatePage = () => {
  
  const handleCreateProduct = async (productData) => {
    return await createProductApi(productData);
  };

  return (
    <div className="product-create-page">
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
};

export default ProductCreatePage;