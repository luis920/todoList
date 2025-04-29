import Home from "./Frontend/paginas/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import injectContext from "./Frontend/store/appContext";
import Register from "./Frontend/paginas/Register";

function App() {
  const location = useLocation();

  return (
    <div>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </div>
  );
}

export default injectContext(App);
