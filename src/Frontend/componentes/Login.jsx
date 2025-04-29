import "../estilos/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="formulario-container ">
          <p className="titulo">Bienvenido</p>
          <form className="formulario">
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
