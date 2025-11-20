import axios from "axios";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, showAlert } from "../globalStore/globalStore.js";
import { showStore, listStore, resetFormularioStore, handleFormStore } from "./clienteStore.js";

import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/clients/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";


export const getAllThunks = ({
  page = 1,
  pageSize = 30,
  search = "",
  start_date = "",
  end_date = "",
} = {}) => {
  return async (dispatch, getState) => {
    await dispatch(showBackDropStore());

    const { authStore, clientesStore } = getState();
    const token = authStore.token;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", pageSize);
    if (search) params.append("search", search);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);

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
        const nuevosClientes = response.data;
        const clientesPrevios = clientesStore.clientes?.results || [];

        // 👇 Unir resultados si es paginación
        const clientesActualizados = {
          ...nuevosClientes,
          results:
            page === 1
              ? nuevosClientes.results
              : [...clientesPrevios, ...nuevosClientes.results],
        };

        dispatch(listStore({ clientes: clientesActualizados }));
      } else {
        console.error("⚠️ Error al obtener clientes:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const createThunks = (userData) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        
        const token = authStore.token;

        await dispatch(showBackDropStore());
 
        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${endpoint_create}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            data: userData, // Aquí se pasa el FormData
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status == 201) {

                await dispatch(resetFormularioStore());
                
                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Registro creado",
                        text: "El registro ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {
                
                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear el registro",
                        text: "Ocurrió un error al crear el registro.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear el registro",
                        text: "Ocurrió un error al crear el registro.",
                    })
                );

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

        }
    };
};

export const showThunk= (id = "") => {

    return async (dispatch, getState) => {
        
        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());
        
        const options = {
            method: 'GET',
            url: `${ URL}${namespace_api}${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 200){

                await dispatch(showStore(
                                            { idCliente : response.data.id ?? '',
                                              apellido  : response.data.apellido ?? '',
                                              nombre    : response.data.nombre ?? '',
                                              email     : response.data.email ?? '',
                                              telefono  : response.data.telefono ?? '',
                                              direccion : response.data.direccion ?? '',
                                            }
                                        )
                                );

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar el registro",
                        text: "Ocurrió un error al mostrar el registro.",
                    })
                );
 
            }
            

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar el registro",
                    text: "Ocurrió un error al mostrar el registro.",
                })
            );
       
        }

    }

}

export const updateThunks = (userData) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token
        console.log("userData ",userData)

        await dispatch(showBackDropStore());

        const options = {
            method: 'PUT',
            url: `${URL}${namespace_api}${userData.id}/${endpoint_update}`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
              },
            data:userData
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            if(response.status == 201 || response.status == 200){
                
                await dispatch(resetFormularioStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Usuario actualizado",
                        text: "El usuario se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
                //toast.success('Successfully created!');
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar usuario",
                        text: "Ocurrió un error al actualizar el usuario.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
               
            }
            

        } catch (error) {

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar usuario",
                    text: "Ocurrió un error al actualizar el usuario.",
                })
            );
            // Manejar errores
            console.error(error);
       
        }

    }

}

export const deleteThunk = (idUser = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${ URL}${namespace_api}${idUser}${endpoint_delete}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);
            
            await dispatch( hideBackDropStore() );
            
            // Despachar la acción setAuthenticated con la respuesta de la solicitud
            if(response.status == 200 || response.status == 204){

                await dispatch( getAllThunks() );

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Registro eliminado",
                        text: "El registro ha sido eliminado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el registro. Inténtalo nuevamente.",
                    })
                );

            }
            
        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Servidor Ocurrió un error al intentar eliminar el registro. Inténtalo nuevamente.",
                })
            );

        }

    }

}

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