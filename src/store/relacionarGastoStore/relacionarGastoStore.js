import { createSlice } from '@reduxjs/toolkit'

export const relacionarGastoStore = createSlice({
  name: 'relacionarGastoStore',
  initialState: {
    idRelacionGasto       : null,
    gasto_id              : null,
    total_gasto           : 0,
    descripcion           : '',
    creado_por_username   : '',
    relacionGastos        : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idRelacionGasto, gasto_id, total_gasto, descripcion, creado_por_username } = action.payload;
      state.idRelacionGasto       = idRelacionGasto;
      state.gasto_id              = gasto_id;
      state.total_gasto           = total_gasto;
      state.descripcion           = descripcion;
      state.creado_por_username   = creado_por_username;
    },
    listStore:(state, action) => {
      state.relacionGastos = action.payload.relacionGastos;
    },
    resetFormularioStore:(state) => {
      state.idRelacionGasto       = null;
      state.gasto_id              = null;
      state.total_gasto           = 0;
      state.descripcion           = '';
      state.creado_por_username   = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = relacionarGastoStore.actions;