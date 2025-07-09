import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const ProductItem = ({ product, onToggleAvailability }) => {
  const { _id, name, price, isAvailable } = product;

  return (
    <div className="product-item">
      <span className="col-name">{name}</span>
      <span className="col-price">{price.toFixed(2)} €</span>
      <span className={`col-status ${isAvailable ? 'available' : 'unavailable'}`}>
        {isAvailable ? 'Disponibile' : 'Non disponibile'}
      </span>
      <div className="col-actions">
        <Link to={`/products/edit/${_id}`} className="btn btn-sm btn-edit">
          Modifica
        </Link>
        <button
          onClick={() => onToggleAvailability(_id)}
          className={`btn btn-sm ${isAvailable ? 'btn-deactivate' : 'btn-activate'}`}
        >
          {isAvailable ? 'Disattiva' : 'Attiva'}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;