import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Users.css";

const UserForm = ({ user, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    isActive: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        username: user.username,
        password: "",
        confirmPassword: "",
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      });
    }
  }, [isEdit, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username) {
      return setError("Il nome utente è obbligatorio.");
    }

    // In case of creation or password change, validate password
    if (!isEdit || (isEdit && formData.password)) {
      if (!formData.password) {
        return setError("La password è obbligatoria.");
      }

      if (formData.password !== formData.confirmPassword) {
        return setError("Le password non corrispondono.");
      }
    }

    // Previene che l'admin disattivi se stesso
    if (isEdit && user._id === currentUser._id && !formData.isActive) {
      return setError("Non puoi disattivare il tuo account.");
    }

    try {
      setError("");
      setLoading(true);

      const dataToSubmit = {
        username: formData.username,
        isAdmin: formData.isAdmin,
        isActive: formData.isActive,
      };

      // Add password only if it's set (create or update with new password)
      if (formData.password) {
        dataToSubmit.password = formData.password;
      }

      await onSubmit(dataToSubmit);
      history("/users");
    } catch (err) {
      setError(
        `Errore durante il ${isEdit ? "salvataggio" : "creazione"} dell'utente`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>{isEdit ? "Modifica Utente" : "Crea Nuovo Utente"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            {isEdit
              ? "Nuova Password (lascia vuoto per non modificare)"
              : "Password"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Conferma Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={!isEdit || !!formData.password}
          />
        </div>
        <div className="form-group checkbox-group">
          <label htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            Amministratore
          </label>
        </div>
        {isEdit && (
          <div className="form-group checkbox-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={user && user._id === currentUser._id}
                title={
                  user && user._id === currentUser._id
                    ? "Non puoi disattivare il tuo account"
                    : ""
                }
              />
              Utente Attivo
            </label>
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history("/users")}
          >
            Annulla
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Salvataggio..."
              : isEdit
              ? "Salva Modifiche"
              : "Crea Utente"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
