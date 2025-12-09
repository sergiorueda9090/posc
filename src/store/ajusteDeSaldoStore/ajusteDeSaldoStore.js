import { createSlice } from '@reduxjs/toolkit'

export const ajusteDeSaldoStore = createSlice({
  name: 'ajusteDeSaldoStore',
  initialState: {
    idAjusteDeSaldo       : null,
    cliente_id            : null,
    valor                 : 0,
    descripcion           : '',
    creado_por_username   : '',
    ajustesDeSaldo        : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idAjusteDeSaldo, cliente_id, valor, descripcion, creado_por_username } = action.payload;
      state.idAjusteDeSaldo       = idAjusteDeSaldo;
      state.cliente_id            = cliente_id;
      state.valor                 = valor;
      state.descripcion           = descripcion;
      state.creado_por_username   = creado_por_username;
    },
    listStore:(state, action) => {
      state.ajustesDeSaldo = action.payload.ajustesDeSaldo;
    },
    resetFormularioStore:(state) => {
      state.idAjusteDeSaldo   = null;
      state.cliente_id  = null;
      state.valor       = '';
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = ajusteDeSaldoStore.actions;