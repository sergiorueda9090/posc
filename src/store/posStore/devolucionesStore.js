import { createSlice } from '@reduxjs/toolkit'

export const devolucionesStore = createSlice({
  name: 'devolucionesStore',
  initialState: {
    devoluciones : [],
    devolucion: {},
  },
  reducers: {
    showStore:(state,action) => {
      state.devolucion = action.payload;
    },
    listStore:(state, action) => {
      state.devoluciones = action.payload.devoluciones;
    },
    resetFormularioStore:(state) => {
      state.devoluciones = [];
    }
  },
});

// Action creators are generated for each case reducer function
export const {showStore,listStore,resetFormularioStore} = devolucionesStore.actions;