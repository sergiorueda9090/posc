import { createSlice } from '@reduxjs/toolkit'

export const ordenPedidoStore = createSlice({
  name: 'ordenPedidoStore',
  initialState: {
    idOrdenPedido: null,
    proveedor_id: null,
    observaciones: '',
    creado_por_username: '',
    ordenesPedido: [],
  },
  reducers: {
    showStore:(state, action) => {
      const { idOrdenPedido, proveedor_id, observaciones, creado_por_username } = action.payload;
      state.idOrdenPedido = idOrdenPedido;
      state.proveedor_id = proveedor_id;
      state.observaciones = observaciones;
      state.creado_por_username = creado_por_username;
    },
    listStore:(state, action) => {
      state.ordenesPedido = action.payload.ordenesPedido;
    },
    resetFormularioStore:(state) => {
      state.idOrdenPedido = null;
      state.proveedor_id = null;
      state.observaciones = '';
      state.creado_por_username = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

export const { showStore, listStore, resetFormularioStore, handleFormStore } = ordenPedidoStore.actions;