import { createSlice } from '@reduxjs/toolkit'

export const clientesStore = createSlice({
  name: 'clientesStore',
  initialState: {
    idCliente   : null,
    nombre      : '',
    apellido    : '',
    email       : '',
    telefono    : '',
    direccion   : '',
    creado_por_username  : '',
    clientes    : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idCliente, nombre, apellido, email, telefono, direccion, creado_por_username } = action.payload;
      state.idCliente   = idCliente;
      state.nombre      = nombre;
      state.apellido    = apellido;
      state.email       = email;
      state.telefono    = telefono;
      state.direccion   = direccion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.clientes = action.payload.clientes;
    },
    resetFormularioStore:(state) => {
      state.idCliente   = null;
      state.nombre      = '';
      state.apellido    = '';
      state.email       = '';
      state.telefono    = '';
      state.direccion   = '';
      state.creado_por_username  = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = clientesStore.actions;