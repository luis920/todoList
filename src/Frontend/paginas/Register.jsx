import logo from "../imagenes/logo.png";
import "../estilos/Register.css";

const Register = () => {
  return (
    <div>
      <img src={logo} alt="logo" className="imgLogo " />
      <div>
        <h3 className="mt-3">
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
            <button className="iniciarSesion">Registrarse</button>
          </form>

          <p className="registrarse">
            ya tienes una cuenta?
            <a rel="noopener noreferrer" href="#" className="">
              iniciar sesion
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
