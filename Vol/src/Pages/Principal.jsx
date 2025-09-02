import React from "react";
import "../Styles/Principal.css";

const Principal = () => {
  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <a className="brand" href="/">
            <img src="/icono.png" alt="Voluntariados Col" className="logo-img" />
            <span className="brand-text">Voluntariados Col</span>
          </a>

          <div className="actions">
            <a className="btn ghost" href="/login">Voluntario</a>
            <a className="btn primary" href="/register">Organización</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="hero-section">
        <h1>
          Transforma tu comunidad a través del{" "}
          <span className="gradient-text">voluntariado</span>
        </h1>
        <p>
          Únete a organizaciones locales, participa en actividades de impacto social
          y gana puntos e insignias por tu contribución a la comunidad.
        </p>

        <div className="hero-buttons">
          <a href="/login" className="btn xl solid">Explorar Actividades</a>
          <a href="/admin" className="btn xl light">Registrar Organización</a>
        </div>
      </main>
    </div>
  );
};

export default Principal;
