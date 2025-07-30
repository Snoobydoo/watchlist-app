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
        <h2>Connexion</h2>
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

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Login;
