import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    console.log("Connexion", formData);
    // Envoyer ici vers le backend
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Connexion</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          //required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          //required
        />

        <button type="submit">Se connecter</button>
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

export default Login;
