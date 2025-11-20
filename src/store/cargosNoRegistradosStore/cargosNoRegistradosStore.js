import { createSlice } from '@reduxjs/toolkit'

export const cargosNoRegistradosStore = createSlice({
  name: 'cargosNoRegistradosStore',
  initialState: {
    idCargosNoRegistrados       : null,
    cliente_id            : null,
    tarjeta_id            : null,
    valor                 : '',
    descripcion           : '',
    creado_por_username   : '',
    cargosNoRegistrados   : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idCargosNoRegistrados, cliente_id, tarjeta_id, valor, descripcion, creado_por_username } = action.payload;
      state.idCargosNoRegistrados   = idCargosNoRegistrados;
      state.cliente_id  = cliente_id;
      state.tarjeta_id  = tarjeta_id;
      state.valor       = valor;
      state.descripcion = descripcion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.cargosNoRegistrados = action.payload.cargosNoRegistrados;
    },
    resetFormularioStore:(state) => {
      state.idRecepcionPago   = null;
      state.cliente_id  = null;
      state.tarjeta_id   = null;
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = cargosNoRegistradosStore.actions;