import axios from "axios";
import { setAuthenticated, loginFail, handleFormStore } from "./authStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/token/";
const namespace_api_user = "/api/user/";
const endpoint           = "me/";

//Función para autenticar usuario
export const getAuth = (username, password) => {

  return async (dispatch) => {
    
    try {
      // Mostrar loader
      dispatch(showBackDropStore());

      // Petición de login
      const response = await axios.post(`${URL}${namespace_api}`, { username, password });

      if (response.status === 200 && response.data.access) {

        const token = response.data.access;

        // Petición adicional para obtener información del usuario autenticado
        const userResponse = await axios.get(`${URL}${namespace_api_user}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userResponse.data;

        // Guardar usuario autenticado en Redux y localStorage
        dispatch(
          setAuthenticated({
            access  : token,
            islogin : true,
            role    : userData.role,
            username: userData.username,
          })
        );

        dispatch(
            showAlert({
                type        : "success",
                title       : "¡Bienvenido!",
                text        : "Has iniciado sesión correctamente.",
                confirmText : "Ir al panel",
                /*action: () => navigate("/dashboard"),*/
            })
        );
      } else {

        dispatch(

          showAlert({
            type: "error",
            title: "¡Error!",
            text: "⚠️ Credenciales incorrectas. Inténtalo nuevamente.",
          })

        );

        dispatch(loginFail());
      }
    } catch (error) {
      // Manejo seguro de errores

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Error desconocido al iniciar sesión.";

        showAlert({
            type: "error",
            title: "¡Error!",
            text:  `❌ ${errorMessage}`,
        })

      dispatch(loginFail());

    } finally {
      // Siempre ocultar loader
      dispatch(hideBackDropStore());
    }
  };
};

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data; // Extraer el nombre y el valor del evento
      console.log("handleFormStoreThunk called with:", name, value);
      dispatch(handleFormStore({ name, value })); // Despachar la acción para actualizar el estado
    };
};