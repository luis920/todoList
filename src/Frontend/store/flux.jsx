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
    },
  };
};

export default getState;
