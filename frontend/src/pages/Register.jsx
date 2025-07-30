import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Efface l'erreur à chaque frappe
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log("Inscription réussie", formData);
    // Envoi au backend à faire ici
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Créer un compte</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">S'inscrire</button>
      </form>

      {error && (
        <div className="form-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width="30"
            height="30"
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.793 2.45-2.537 4.5-4.84 5.544A9.969 9.969 0 0112 19a9.969 9.969 0 01-4.702-1.456C5.995 16.5 4.251 14.45 3.458 12z"
            />
          </svg>
          {error}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width="30"
            height="30"
            style={{ marginLeft: "8px", verticalAlign: "middle" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.793 2.45-2.537 4.5-4.84 5.544A9.969 9.969 0 0112 19a9.969 9.969 0 01-4.702-1.456C5.995 16.5 4.251 14.45 3.458 12z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Register;
