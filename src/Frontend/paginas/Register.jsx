import logo from "../imagenes/logo.png";
import "../estilos/Register.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });
  const manejadorDeCambiosEnFormulario = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };
  const manejadorDeRegistro = async (e) => {
    e.preventDefault();

    if (
      !nuevoUsuario.nombre ||
      !nuevoUsuario.correo ||
      !nuevoUsuario.contraseña
    ) {
      Swal.fire("Error", "Por favor, completa todos los campos", "error");
      return;
    }

    try {
      const result = await actions.agregarUsuario(nuevoUsuario);

      if (result) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Te has registrado con éxito.",
        });
        navigate("/");
        setNuevoUsuario({
          nombre: "",
          correo: "",
          contraseña: "",
        });
      } else {
        const errorMessage =
          result?.error || "Ha ocurrido un error desconocido";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error en manejadorDeRegistro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error al enviar el formulario, por favor intenta de nuevo.",
      });
    }
  };
  return (
    <div className="d-flex justify-content-center flex-column align-items-center mt-3">
      <img src={logo} alt="logo" className="imgLogo    " />
      <div>
        <h3 className="mt-3 text-center">
          {" "}
          <strong>
            "Porque un día bien organizado, es un día productivo."
          </strong>{" "}
        </h3>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="formulario-container ">
          <p className="titulo">Formulario de registro</p>
          <form className="formulario" onSubmit={manejadorDeRegistro}>
            <div className="inputs-formulario">
              <label htmlFor="nombre">Nombre de usuario</label>
              <input
                onChange={manejadorDeCambiosEnFormulario}
                value={nuevoUsuario.nombre}
                type="nombre"
                name="nombre"
                id="nombre"
                placeholder=""
              />
            </div>
            <div className="inputs-formulario">
              <label htmlFor="correo">Correo</label>
              <input
                onChange={manejadorDeCambiosEnFormulario}
                value={nuevoUsuario.correo}
                type="text"
                name="correo"
                id="correo"
                placeholder=""
              />
            </div>
            <div className="inputs-formulario">
              <label htmlFor="contraseña">Contraseña</label>
              <input
                onChange={manejadorDeCambiosEnFormulario}
                value={nuevoUsuario.contraseña}
                type="password"
                name="contraseña"
                id="contraseña"
                placeholder=""
              />
            </div>
            <button className="iniciarSesion mt-3">Registrarse</button>
          </form>

          <p className="registrarse">
            ya tienes una cuenta?
            <Link to={"/"}>iniciar sesion</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
