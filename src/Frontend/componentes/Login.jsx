import "../estilos/Login.css";

const Login = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="formulario-container ">
          <p className="titulo">Bienvenido</p>
          <form className="formulario">
            <div className="inputs-formulario">
              <label for="correo">Correo</label>
              <input type="text" name="correo" id="correo" placeholder="" />
            </div>
            <div className="inputs-formulario">
              <label for="contraseña">Contraseña</label>
              <input
                type="contraseña"
                name="constraseña"
                id="contraseña"
                placeholder=""
              />
              <div className="olvidasteContraseña">
                <a href="#">Olvidaste tu contraseña ?</a>
              </div>
            </div>
            <button className="iniciarSesion">Iniciar sesion</button>
          </form>

          <p className="registrarse">
            No tienes una cuenta?
            <a rel="noopener noreferrer" href="#" className="">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
