import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext.jsx";
import "../estilos/Login.css";

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    correo: "",
    contraseña: "",
  });

  const manejadorDeCambiosEnInputs = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const manejadorDeInicioDeSesion = async (e) => {
    e.preventDefault();

    if (!usuario.correo || !usuario.contraseña) {
      Swal.fire("Error", "Por favor completa todos los campos", "error");
      return;
    }

    try {
      const result = await actions.login(usuario.correo, usuario.contraseña);

      if (!result || !result.access_token || !result.usuario) {
        Swal.fire("Error", "Correo o contraseña incorrectos", "error");
        return;
      }
      Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        text: "Redirigiendo...",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al iniciar sesión, intenta de nuevo.",
        "error"
      );
    }
    navigate("/Tareas");
  };
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="formulario-container ">
          <p className="titulo">Bienvenido</p>
          <form className="formulario" onSubmit={manejadorDeInicioDeSesion}>
            <div className="inputs-formulario">
              <label htmlFor="correo">Correo</label>
              <input
                onChange={manejadorDeCambiosEnInputs}
                value={usuario.correo}
                type="text"
                name="correo"
                id="correo"
              />
            </div>
            <div className="inputs-formulario">
              <label htmlFor="contraseña">Contraseña</label>
              <input
                onChange={manejadorDeCambiosEnInputs}
                value={usuario.contraseña}
                type="password"
                name="contraseña"
                id="contraseña"
              />
              {/* <div className="olvidasteContraseña text-center">
                <a href="#">Olvidaste tu contraseña ?</a>
              </div> */}
            </div>

            <button className="iniciarSesion mt-3">Iniciar sesion</button>
          </form>

          <p className="registrarse mt-2">
            No tienes una cuenta?
            <Link to={"/registro"}>Crear cuenta</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
