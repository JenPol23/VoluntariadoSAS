import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginGoogle, loginUsuario, registroUsuario, resetPassword } from "../Firebase/client";
import "../Styles/LoginVol.css";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const handleSubmit = async () => {
    // Validaciones mínimas
    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && (!formData.username || !formData.confirmPassword))
    ) {
      setFormData({ ...formData, error: "Por favor, completa todos los campos." });
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormData({ ...formData, error: "Las contraseñas no coinciden." });
      return;
    }

    try {
      if (isLogin) {
        await loginUsuario(formData, setFormData);
      } else {
        await registroUsuario(formData, setFormData);
      }
      navigate("/"); // Home
    } catch (error) {
      console.log("Error de autenticación:", error);
      setFormData({ ...formData, error: "Error al iniciar sesión o registrarse" });
    }

    setTimeout(() => setFormData({ ...formData, error: "" }), 3000);
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setFormData({
        ...formData,
        error: "Por favor, ingresa tu correo para recuperar la contraseña.",
      });
      return;
    }
    try {
      await resetPassword(formData.email);
      setFormData({
        ...formData,
        error: "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
      });
    } catch (error) {
      console.error(error);
      setFormData({ ...formData, error: "Error al enviar el correo de recuperación." });
    }
    setTimeout(() => setFormData({ ...formData, error: "" }), 3000);
  };

  return (
    <main className="auth">
      {/* botón cerrar */}
      <button className="close" onClick={() => navigate("/")}>❌</button>

      <section className="auth-card">
        <div className="brand">
          <img src="/icono.png" alt="Voluntariados Col" />
          <span className="brand-text">Voluntariados Col</span>
        </div>

        <h4 className="auth-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h4>
        <p className="auth-desc">
          {isLogin
            ? "Ingrese su correo electrónico para iniciar esta aplicación."
            : "Ingrese los datos correspondientes para registrarse."}
        </p>

        {!isLogin && (
          <input
            className="input"
            type="text"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        )}

        <input
          className="input"
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        {!isLogin && (
          <input
            className="input"
            type="password"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        )}

        {formData.error && <div className="alert">{formData.error}</div>}

        <button className="btn primary xl" onClick={handleSubmit}>
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>

        <button
          className="btn google xl"
          onClick={async () => {
            await loginGoogle();
            navigate("/");
          }}
        >
          <span className="g-icon" aria-hidden>G</span>
          {isLogin ? "Iniciar Sesión con Google" : "Registrarse con Google"}
        </button>

        {isLogin && (
          <button className="btn link" onClick={handleResetPassword}>
            Recuperar Contraseña
          </button>
        )}

        <p className="switch">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Regístrate" : "Inicia Sesión"}
          </button>
        </p>
      </section>
    </main>
  );
};

export default Login;
