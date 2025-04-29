import logo from "../imagenes/logo.png";
import "../estilos/Home.css";

const Home = () => {
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
    </div>
  );
};

export default Home;
