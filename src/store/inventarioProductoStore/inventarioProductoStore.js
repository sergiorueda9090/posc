import { createSlice } from '@reduxjs/toolkit'

export const inventarioProductoStore = createSlice({
  name: 'inventarioProductoStore',
  initialState: {
    idInventario        : null,
    cantidad            : '',
    inventario          : [],
    creado_por_username : '',
  },
  reducers: {
    showStore:(state,action) => {
      const { id, cantidad_unidades } = action.payload;
      console.log(" === id === ", id);
      console.log(" === cantidad_unidades === ", cantidad_unidades);
      state.idInventario  = id;
      state.cantidad      = cantidad_unidades;
    },
    listStore:(state, action) => {
      state.inventario = action.payload.inventario;
    },
    resetFormularioStore:(state) => {
      state.idInventario   = null;
      state.cantidad      = '';
      state.inventario    = [];
      state.creado_por_username  = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = inventarioProductoStore.actions;