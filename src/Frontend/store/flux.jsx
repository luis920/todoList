const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      tareas: [],
      usuario: [],
      token: localStorage.getItem("token") || null,
    },
    actions: {
      obtenerTareas: async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/tareas", {});
          if (response.ok) {
            const data = await response.json();
            setStore({ tareas: data });
            return data;
          } else {
            console.error("Error al obtener tareas:", response.status);
          }
        } catch (error) {
          console.error("Error al obtener tareas:", error);
          return null;
        }
      },

      eliminarTarea: async (id) => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/tarea/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            setStore((prevStore) => ({
              tareas: prevStore.tareas.filter((tarea) => tarea.id !== id),
            }));
            return true;
          } else {
            console.error(
              "Error en la respuesta del servidor:",
              response.status
            );
            return false;
          }
        } catch (error) {
          console.error("Error al eliminar tarea:", error);
          return false;
        }
      },
      agregarUsuario: async (nuevoUsuario) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/registro", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoUsuario),
          });

          if (response.ok) {
            const usuarioRegistrado = await response.json();
            const store = getStore();
            setStore({
              usuario: [...store.usuario, usuarioRegistrado],
            });
            return usuarioRegistrado;
          } else {
            console.error("Error al registrarse:", response.status);
          }
        } catch (error) {
          console.error("Error al registrarse:", error);
        }
      },
      login: async (correo, contraseña) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/iniciarsesion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contraseña }),
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("token", data.access_token);
            // localStorage.setItem("usuario", data.usuario);

            setStore({ usuario: data.usuario, token: data.access_token });

            return data;
          } else {
            console.log(
              "Error al iniciar sesion:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al iniciar sesion:", error);
        }
      },
      cerrarSesion: () => {
        localStorage.removeItem("token");
      },
      actualizarTarea: async (id, tareaActualizada) => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/tarea/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tareaActualizada),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al actualizar:", errorData);
            return {
              error: errorData.message || "Error al actualizar la tarea",
            };
          }

          const actualizarTarea = await response.json();
          const store = getStore();
          const actualizarTareas = store.tareas.map((tarea) =>
            tarea.id === id ? actualizarTarea : tarea
          );
          setStore({ tareas: actualizarTareas });
          return actualizarTarea;
        } catch (error) {
          console.error("Error actualizando tarea:", error);
          return { error: "Error de conexión con el servidor" };
        }
      },
      agregarTarea: async (nuevaTarea) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/tarea", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevaTarea),
          });

          if (response.ok) {
            const nuevaTarea = await response.json();
            const store = getStore();
            setStore({
              tareas: [...store.tareas, nuevaTarea],
            });
            return nuevaTarea;
          } else {
            console.error("Error al agregar tarea:", response.status);
          }
        } catch (error) {
          console.error("Error al agregar tarea:", error);
        }
      },
    },
  };
};

export default getState;
