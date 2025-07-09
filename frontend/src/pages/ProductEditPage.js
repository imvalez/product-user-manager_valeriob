import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../components/products/ProductForm';
import { getProductByIdApi, updateProductApi } from '../utils/api';
import './Pages.css';

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (err) {
        setError('Errore nel caricamento del prodotto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (productData) => {
    return await updateProductApi(id, productData);
  };

  if (loading) return <div className="loading">Caricamento prodotto...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Prodotto non trovato</div>;

  return (
    <div className="product-edit-page">
      <ProductForm product={product} onSubmit={handleUpdateProduct} isEdit={true} />
    </div>
  );
};

export default ProductEditPage;