import axios from "axios";
import { setAuthenticated, loginFail, handleFormStore } from "./authStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";

import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/token/";
const namespace_api_user = "/api/user/";
const endpoint           = "me/";

// Funcion para autenticar usuario
export const getAuth = (username, password) => {

  return async (dispatch) => {

    try {
      // Mostrar loader
      dispatch(showBackDropStore());

      // Peticion de login (no usa la instancia api porque aun no hay token)
      const response = await axios.post(`${URL}${namespace_api}`, { username, password });

      if (response.status === 200 && response.data.access) {

        const accessToken  = response.data.access;
        const refreshToken = response.data.refresh || "";

        // Peticion adicional para obtener informacion del usuario autenticado
        const userResponse = await axios.get(`${URL}${namespace_api_user}${endpoint}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = userResponse.data;

        // Guardar usuario autenticado en Redux y localStorage
        dispatch(
          setAuthenticated({
            access  : accessToken,
            refresh : refreshToken,
            role    : userData.role,
            username: userData.username,
          })
        );

        dispatch(
            showAlert({
                type        : "success",
                title       : "Bienvenido!",
                text        : `Hola ${userData.username}, has iniciado sesion correctamente.`,
                confirmText : "Ir al panel",
            })
        );
      } else {

        dispatch(
          showAlert({
            type: "error",
            title: "Error!",
            text: "Credenciales incorrectas. Intentalo nuevamente.",
          })
        );

        dispatch(loginFail());
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Error desconocido al iniciar sesion.";

      dispatch(
        showAlert({
          type: "error",
          title: "Error de autenticacion",
          text: errorMessage,
        })
      );

      dispatch(loginFail());

    } finally {
      dispatch(hideBackDropStore());
    }
  };
};

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data;
      dispatch(handleFormStore({ name, value }));
    };
};
