import { createSlice } from '@reduxjs/toolkit'

export const gastoStore = createSlice({
  name: 'gastoStore',
  initialState: {
    idGasto               : null,
    nombre                : '',
    descripcion           : '',
    creado_por_username   : '',
    gastos                : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idGasto, nombre, descripcion, creado_por_username } = action.payload;
      state.idGasto     = idGasto;
      state.nombre      = nombre;
      state.descripcion = descripcion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.gastos = action.payload.gastos;
    },
    resetFormularioStore:(state) => {
      state.idGasto   = null;
      state.nombre      = '';
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = gastoStore.actions;