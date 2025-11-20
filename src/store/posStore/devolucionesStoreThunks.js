import axios from "axios";
import { showBackDropStore, hideBackDropStore,openModalShared, closeModalShared, showAlert } from "../globalStore/globalStore.js";
import { showStore, listStore, resetFormularioStore } from "./devolucionesStore.js";

import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/devoluciones/";
const endpoint_create    = "create/";
const endpoint_list      = "list/";

export const getAllThunks = ({page = 1,  pageSize = 10, search = "", start_date = "", end_date = "",} = {}) => {

  return async (dispatch, getState) => {

    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    //Construir los parámetros dinámicamente
    let params = new URLSearchParams();
    
    params.append("page", page);
    params.append("page_size", pageSize);
    
    if (search) params.append("search", search);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint_list}?${params.toString()}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {

        const devoluciones = response.data;

        if(devoluciones.length === 0){
          await dispatch(
            showAlert({
              type: "info",
              title: "No hay devoluciones",
              text: "No se encontraron devoluciones registradas.",
            })
          );

          await dispatch(listStore({ devoluciones: [] }));

        }else{
          
          await dispatch(listStore({ devoluciones }));
          
        }

        

      } else {
        console.error("⚠️ Error al obtener categorias:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
    } finally {
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
                console.log(" === showThunk response.data ==== ", response.data.categoria_id );
                await dispatch(showStore(
                                            { 
                                              idSubcategoria     : response.data.id ?? '',
                                              categoria_id       : response.data.categoria_id ?? '',
                                              nombre             : response.data.nombre ?? '',
                                              descripcion        : response.data.descripcion ?? '',
                                              creado_por_username: response.data.creado_por_username ?? '',
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

export const createThunk = (data) => {

     return async (dispatch, getState) => {
        const errorMessage = "Verifica que todos los campos estén correctos.";
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
            data: data, // Aquí se pasa el FormData
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status == 201) {

                await dispatch(resetFormularioStore());
                
                await dispatch(
                    showAlert({
                        type: "success",
                        title: "🎉 ¡Devolución registrada con éxito!",
                        text: `La devolución  fue creada correctamente 💰<br>`,
                    })
                );

                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {
                
                await dispatch(
                    showAlert({
                        type: "warning",
                        title: "⚠️ Ocurrió un inconveniente",
                        text: "La venta no pudo ser creada correctamente. Intenta nuevamente 🌀",
                    })
                );
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            }
        } catch (error) {

            await dispatch(
                showAlert({
                    type: "error",
                    title: "💥 Error al crear la devolución",
                    text: `${errorMessage}<br>Por favor revisa los datos o intenta más tarde 🔁`,
                })
            );

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

        }

    };

};
