const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      tareas: [],
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
      agregarCliente: async (nuevoCliente) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/cliente", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoCliente),
          });

          if (response.ok) {
            const nuevoCliente = await response.json();
            const store = getStore();
            setStore({ clientes: [...store.clientes, nuevoCliente] });
            return nuevoCliente;
          } else {
            console.error("Error al agregar cliente:", response.status);
          }
        } catch (error) {
          console.error("Error al agregar cliente:", error);
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
    },
  };
};

export default getState;
