import { createSlice } from '@reduxjs/toolkit'

export const tarjetasBancariasStore = createSlice({
  name: 'tarjetasBancariasStore',
  initialState: {
    idTarjeta             : null,
    nombre                : '',
    pan                   : '',
    descripcion           : '',
    creado_por_username   : '',
    tarjetas              : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idTarjeta, nombre, pan, descripcion, creado_por_username } = action.payload;
      state.idTarjeta     = idTarjeta;
      state.nombre      = nombre;
      state.pan         = pan;
      state.descripcion = descripcion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.tarjetas = action.payload.tarjetas;
    },
    resetFormularioStore:(state) => {
      state.idTarjeta   = null;
      state.nombre      = '';
      state.pan         = '';
      state.descripcion = '';
      state.creado_por_username  = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = tarjetasBancariasStore.actions;