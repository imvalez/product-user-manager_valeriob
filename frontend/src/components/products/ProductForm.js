import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const ProductForm = ({ product, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isAvailable: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Stato aggiunto

  const history = useNavigate();

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(), // Convertito in stringa per l'input
        isAvailable: product.isAvailable,
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione base
    if (!formData.name || !formData.description || !formData.price) {
      return setError("Tutti i campi sono obbligatori.");
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      return setError("Il prezzo deve essere un numero maggiore di zero.");
    }

    try {
      setError("");
      setLoading(true);
      await onSubmit({
        ...formData,
        price: Number(formData.price),
      });

      // Gestione del messaggio di successo
      setSuccessMessage(
        isEdit
          ? "Prodotto aggiornato con successo!"
          : "Prodotto creato con successo!"
      );

      setTimeout(() => history("/products"), 2000);
    } catch (err) {
      setError(
        `Errore durante ${isEdit ? "la modifica" : "la creazione"} del prodotto`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{isEdit ? "Modifica Prodotto" : "Crea Nuovo Prodotto"}</h2>

      {/* Messaggi di stato */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <div className="loading-spinner"></div>
        </div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        {/* Campi del form */}
        <div className="form-group">
          <label htmlFor="name">Nome Prodotto</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrizione</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Prezzo (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        {isEdit && (
          <div className="form-group checkbox-group">
            <label htmlFor="isAvailable">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Disponibile
            </label>
          </div>
        )}

        {/* Pulsanti di azione */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history("/products")}
          >
            Annulla
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Salvataggio..."
              : isEdit
              ? "Salva Modifiche"
              : "Crea Prodotto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
