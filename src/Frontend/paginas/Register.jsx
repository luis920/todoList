import logo from "../imagenes/logo.png";
import "../estilos/Register.css";
import { Link } from "react-router-dom";

const Register = () => {
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
          <form className="formulario">
            <div className="inputs-formulario">
              <label htmlFor="nombre">Nombre de usuario</label>
              <input type="nombre" name="nombre" id="nombre" placeholder="" />
            </div>
            <div className="inputs-formulario">
              <label htmlFor="correo">Correo</label>
              <input type="text" name="correo" id="correo" placeholder="" />
            </div>
            <div className="inputs-formulario">
              <label htmlFor="contraseña">Contraseña</label>
              <input
                type="contraseña"
                name="constraseña"
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
