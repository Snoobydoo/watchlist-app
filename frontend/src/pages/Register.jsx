import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, password, confirmPassword } = formData;

    // Validation front
    if (!username || !email || !password || !confirmPassword) {
      setError("Tous les champs doivent être remplis.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/user/register`,
        { username, email, password, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(res.data.message || "Inscription réussie !");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Axios error:", err);
      if (err.response) {
        setError(err.response.data?.error || "Erreur serveur.");
      } else if (err.request) {
        setError("Impossible de joindre le serveur (CORS ou réseau).");
      } else {
        setError(err.message || "Erreur inconnue côté client.");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Créer un compte</h1>
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

      {error && <div className="form-error">⚠️ {error}</div>}
      {success && <div className="form-success">✅ {success}</div>}
    </div>
  );
};

export default Register;
