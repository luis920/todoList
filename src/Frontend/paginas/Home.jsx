import logo from "../imagenes/logo.png";
import "../estilos/Home.css";
import Login from "../componentes/Login";

const Home = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-3 text-center">
      <img src={logo} alt="logo" className="imgLogo " />
      <h3 className="mt-3">
        <strong>"Porque un día bien organizado, es un día productivo."</strong>
      </h3>
      <Login />
    </div>
  );
};

export default Home;
