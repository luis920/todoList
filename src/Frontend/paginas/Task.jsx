import React, { useEffect, useContext, useState } from "react";
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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarTarea, setEditarTarea] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "",
  });

  useEffect(() => {
    actions.obtenerTareas();
  }, []);

  const manejadorDeCambiosEnInput = (e) => {
    const { name, value } = e.target;
    if (editarTarea) {
      setNuevaTarea({ ...nuevaTarea, [name]: value });
    } else {
      setNuevaTarea({ ...nuevaTarea, [name]: value });
    }
  };
  const manejadorAgregarTarea = async (e) => {
    e.preventDefault();

    if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.estado) {
      Swal.fire("Error", "Por favor, completa todos los campos", "error");
      return;
    }

    const confirmSubmit = await Swal.fire({
      title: editarTarea ? "¿Actualizar tarea?" : "¿Agregar tarea?",
      text: editarTarea
        ? "Se actualizarán los datos de la tarea."
        : "Se agregará una nueva tarea.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editarTarea ? "Sí, actualizar" : "Sí, agregar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmSubmit.isConfirmed) return;

    try {
      let result;
      if (editarTarea) {
        result = await actions.actualizarTarea(editarTarea.id, nuevaTarea);
      } else {
        const tareaConUsuario = {
          ...nuevaTarea,
          usuario_id: store.usuario?.id,
        };
        result = await actions.agregarTarea(tareaConUsuario);
      }

      if (result?.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Ha ocurrido un error: ${result.error}`,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: editarTarea ? "Tarea actualizada" : "Tarea agregada",
          text: editarTarea
            ? "Los datos se han actualizado correctamente."
            : "¡Una nueva tarea ha sido agregada!",
        });

        actions.obtenerTareas();
        setNuevaTarea({
          titulo: "",
          descripcion: "",
          estado: "",
        });
        setEditarTarea(null);
        setMostrarModal(false);
      }
    } catch (error) {
      console.error("Error en manejadorAgregarTarea:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al enviar el formulario. Intente nuevamente.",
      });
    }
  };

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

  const manejadorAbrirModal = () => {
    setEditarTarea(null);
    setNuevaTarea({
      titulo: "",
      descripcion: "",
      estado: "",
      usuario_id: "",
    });
    setMostrarModal(true);
  };
  const manejadorCerrarModal = () => {
    setMostrarModal(false);
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
          <button
            className="btn btn-primary mt-3"
            onClick={() => manejadorAbrirModal()}
          >
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
        <div>
          {mostrarModal && (
            <div>
              <div className="modal-content">
                <h2 className="">Nueva Tarea</h2>
                <form
                  className="tarea-formulario "
                  onSubmit={manejadorAgregarTarea}
                >
                  <div className="d-flex">
                    <div className="d-flex column ">
                      <label htmlFor="proveedor">Titulo</label>
                      <input
                        onChange={manejadorDeCambiosEnInput}
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={nuevaTarea.titulo}
                        required
                      />
                    </div>
                    <div className="d-flex column ">
                      <label className="mx-2" htmlFor="descripcion ">
                        Descripcion
                      </label>
                      <input
                        onChange={manejadorDeCambiosEnInput}
                        className="mx-2"
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={nuevaTarea.descripcion}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="d-flex column ">
                      <label htmlFor="producto">Estado</label>
                      <select
                        onChange={manejadorDeCambiosEnInput}
                        type="text"
                        id="estado"
                        name="estado"
                        value={nuevaTarea.estado}
                        required
                      >
                        <option value="Selecciona una opcion">
                          Selecciona una opcion
                        </option>
                        <option value="entregado">terminado</option>
                        <option value="en proceso">en proceso</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex">
                    <button
                      type="submit"
                      className="button-form btn btn-primary w-50 "
                    >
                      {editarTarea ? "Actualizar" : "Agregar"}
                    </button>
                    <button
                      type="button"
                      className="button-form btn btn-secondary w-50 "
                      onClick={manejadorCerrarModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Task;
