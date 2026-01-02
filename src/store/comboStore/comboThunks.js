import axios from "axios";
import { showBackDropStore, hideBackDropStore, openModalShared, closeModalShared, showAlert } from "../globalStore/globalStore.js";
import { showStore, listStore, listActivosStore, resetFormularioStore, handleFormStore, addProductoToComboStore, removeProductoFromComboStore, updateProductoInComboStore } from "./comboStore.js";

import { URL } from "../../constants/constantGlogal.js";

const namespace_api      = "/api/combos/";
const endpoint           = "list/";
const endpoint_active    = "active/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "/update/";
const endpoint_add_product = "/add-product/";
const endpoint_remove_product = "/remove-product/";
const endpoint_update_product = "/update-product/";


// ======================================================
// Obtener Todos los Combos (Paginado)
// ======================================================
export const getAllThunks = ({page = 1, pageSize = 10, search = "", activo = ""} = {}) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    let params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", pageSize);

    if (search) params.append("search", search);
    if (activo !== "") params.append("activo", activo);

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint}?${params.toString()}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const combos = response.data;
        await dispatch(listStore({ combos: combos }));
      } else {
        console.error("⚠️ Error al obtener combos:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Obtener Combos Activos (Para POS)
// ======================================================
export const getActiveCombosThunks = () => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint_active}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const combosActivos = response.data;
        await dispatch(listActivosStore({ combosActivos }));
      } else {
        console.error("⚠️ Error al obtener combos activos:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    }
  };
};


// ======================================================
// Crear Combo
// ======================================================
export const createThunks = (comboData) => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const data = new FormData();
    data.append("nombre", comboData.nombre);
    data.append("activo", comboData.activo);

    const options = {
      method: 'POST',
      url: `${URL}${namespace_api}${endpoint_create}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    try {
      const response = await axios.request(options);

      if (response.status === 201) {
        await dispatch(resetFormularioStore());

        await dispatch(showAlert({
          type: "success",
          title: "Combo creado",
          text: "El combo ha sido creado exitosamente.",
        }));

        await dispatch(getAllThunks());
        await dispatch(closeModalShared());
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al crear el combo",
          text: "Ocurrió un error al crear el combo.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al crear el combo",
        text: error.response?.data?.error || "Ocurrió un error al crear el combo.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Mostrar Combo por ID
// ======================================================
export const showThunk = (id = "") => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const options = {
      method: 'GET',
      url: `${URL}${namespace_api}${id}/`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        await dispatch(showStore({ combo: response.data }));
        await dispatch(openModalShared());
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al mostrar el combo",
          text: "Ocurrió un error al mostrar el combo.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al mostrar el combo",
        text: "Ocurrió un error al mostrar el combo.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Actualizar Combo
// ======================================================
export const updateThunks = (comboData) => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const data = new FormData();
    data.append("nombre", comboData.nombre);
    data.append("activo", comboData.activo);

    const options = {
      method: 'PUT',
      url: `${URL}${namespace_api}${comboData.id}${endpoint_update}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
      data: data
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200 || response.status === 201) {
        await dispatch(resetFormularioStore());

        await dispatch(showAlert({
          type: "success",
          title: "Combo actualizado",
          text: "El combo se ha actualizado correctamente.",
        }));

        await dispatch(getAllThunks());
        await dispatch(closeModalShared());
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al actualizar",
          text: "Ocurrió un error al actualizar el combo.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al actualizar combo",
        text: error.response?.data?.error || "Ocurrió un error al actualizar el combo.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
      await dispatch(closeModalShared());
    }
  };
};


// ======================================================
// Eliminar Combo
// ======================================================
export const deleteThunk = (idCombo = "") => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const options = {
      method: 'DELETE',
      url: `${URL}${namespace_api}${idCombo}${endpoint_delete}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200 || response.status === 204) {
        await dispatch(getAllThunks());

        await dispatch(showAlert({
          type: "success",
          title: "Combo eliminado",
          text: "El combo ha sido eliminado exitosamente.",
        }));
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar el combo.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al eliminar",
        text: "Ocurrió un error al intentar eliminar el combo.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Agregar Producto a Combo
// ======================================================
export const addProductToComboThunk = (comboId, productoData) => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const data = new FormData();
    data.append("producto_id", productoData.producto_id);
    data.append("precio_combo", productoData.precio_combo);
    data.append("cantidad", productoData.cantidad || 1);

    const options = {
      method: 'POST',
      url: `${URL}${namespace_api}${comboId}${endpoint_add_product}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    try {
      const response = await axios.request(options);

      if (response.status === 201) {
        await dispatch(addProductoToComboStore(response.data));

        await dispatch(showAlert({
          type: "success",
          title: "Producto agregado",
          text: "El producto ha sido agregado al combo.",
        }));
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al agregar producto",
          text: "Ocurrió un error al agregar el producto.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al agregar producto",
        text: error.response?.data?.error || "Ocurrió un error al agregar el producto.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Eliminar Producto de Combo
// ======================================================
export const removeProductFromComboThunk = (comboId, productoComboId) => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const options = {
      method: 'DELETE',
      url: `${URL}${namespace_api}${comboId}${endpoint_remove_product}${productoComboId}/`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200 || response.status === 204) {
        await dispatch(removeProductoFromComboStore({ id: productoComboId }));

        await dispatch(showAlert({
          type: "success",
          title: "Producto eliminado",
          text: "El producto ha sido eliminado del combo.",
        }));
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al eliminar",
          text: "Ocurrió un error al eliminar el producto.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al eliminar",
        text: "Ocurrió un error al eliminar el producto.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Actualizar Producto en Combo
// ======================================================
export const updateProductInComboThunk = (comboId, productoComboId, productoData) => {
  return async (dispatch, getState) => {
    const { authStore } = getState();
    const token = authStore.token;

    await dispatch(showBackDropStore());

    const data = new FormData();
    data.append("precio_combo", productoData.precio_combo);
    data.append("cantidad", productoData.cantidad || 1);

    const options = {
      method: 'PUT',
      url: `${URL}${namespace_api}${comboId}${endpoint_update_product}${productoComboId}/`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
      data: data
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200 || response.status === 201) {
        await dispatch(updateProductoInComboStore({
          id: productoComboId,
          precio_combo: productoData.precio_combo,
          cantidad: productoData.cantidad,
        }));

        await dispatch(showAlert({
          type: "success",
          title: "Producto actualizado",
          text: "El producto se ha actualizado en el combo.",
        }));
      } else {
        await dispatch(showAlert({
          type: "error",
          title: "Error al actualizar",
          text: "Ocurrió un error al actualizar el producto.",
        }));
      }
    } catch (error) {
      await dispatch(showAlert({
        type: "error",
        title: "Error al actualizar",
        text: error.response?.data?.error || "Ocurrió un error al actualizar el producto.",
      }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};


// ======================================================
// Utilidades
// ======================================================
export const resetFormularioThunk = () => {
  return async (dispatch) => {
    await dispatch(resetFormularioStore());
  };
};

export const handleFormStoreThunk = (data) => {
  return async (dispatch) => {
    const { name, value } = data;
    dispatch(handleFormStore({ name, value }));
  };
};
