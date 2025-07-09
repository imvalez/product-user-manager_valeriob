import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductsApi, toggleProductAvailabilityApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProductItem from './ProductItem';
import './Products.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setProducts(data);
    } catch (err) {
      setError('Errore nel caricamento dei prodotti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await toggleProductAvailabilityApi(id);
      // Update the products list
      fetchProducts();
    } catch (err) {
      setError('Errore nella modifica dello stato del prodotto');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Caricamento prodotti...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Lista Prodotti</h2>
        {isAuthenticated && (
          <Link to="/products/create" className="btn btn-primary">
            Nuovo Prodotto
          </Link>
        )}
      </div>
      
      {products.length === 0 ? (
        <p>Nessun prodotto disponibile.</p>
      ) : (
        <div className="product-list">
          <div className="product-list-header-row">
            <span className="col-name">Nome</span>
            <span className="col-price">Prezzo</span>
            <span className="col-status">Stato</span>
            <span className="col-actions">Azioni</span>
          </div>
          {products.map(product => (
            <ProductItem
              key={product._id}
              product={product}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
