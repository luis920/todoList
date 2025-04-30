import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import logo from "../imagenes/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faTrash,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "../estilos/Task.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.obtenerTareas();
  }, []);

  const manejadorEliminarTarea = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await actions.eliminarTarea(id);

        if (result) {
          Swal.fire({
            icon: "success",
            title: "Tarea eliminada",
            text: "La tarea ha sido eliminada con éxito.",
          });
          actions.obtenerTareas();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al eliminar la tarea.",
          });
        }
      } catch (error) {
        console.error("Error en manejadorEliminarTarea:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al intentar eliminar la tarea. Intenta nuevamente.",
        });
      }
    }
  };
  const manejadorCierreDeSesion = () => {
    actions.cerrarSesion();
    navigate("/");
  };
  return (
    <>
      <div className=" d-flex justify-content-end mt-3 mx-3">
        <button
          className="btn btn-danger mt-3"
          onClick={manejadorCierreDeSesion}
        >
          <FontAwesomeIcon
            className="icon-sidebar text-light mx-1"
            icon={faRightFromBracket}
          />
          Cerrar Sesion
        </button>
      </div>

      <div className="d-flex justify-content-center flex-column align-items-center mt-3">
        <img src={logo} alt="logo" className="imgLogo    " />
        <div className="mb-4">
          <button className="btn btn-primary mt-3">
            <FontAwesomeIcon
              className="icon-sidebar text-light mx-1"
              icon={faPlus}
            />
            Agregar Tarea
          </button>

          {/* Tabla de Tareas */}
          <div className="table-responsive">
            <h1 className="">Historial de tareas</h1>
            <table className="table table-bordered bg-light">
              <thead className="table-dark ">
                <tr>
                  <th>Tarea ID</th>
                  <th>Titulo</th>
                  <th>Descripcion</th>
                  <th>Estado de la tarea</th>
                  <th>Id del usuario asignado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {store.tareas
                  .filter((tarea) => tarea.usuario_id === store.usuario?.id)
                  .map((tarea) => (
                    <tr key={tarea.id}>
                      <td>{tarea.id}</td>
                      <td>{tarea.titulo}</td>
                      <td>{tarea.descripcion}</td>
                      <td>{tarea.estado}</td>
                      <td>{tarea.usuario_id}</td>
                      <td>
                        <button>
                          <FontAwesomeIcon
                            className="icon-actions-pen"
                            icon={faPencil}
                          />
                        </button>
                        <button
                          onClick={() => manejadorEliminarTarea(tarea.id)}
                        >
                          <FontAwesomeIcon
                            className="icon-actions-trash"
                            icon={faTrash}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Task;
