import { createSlice } from '@reduxjs/toolkit'

export const categoriaStore = createSlice({
  name: 'categoriaStore',
  initialState: {
    idCategoria           : null,
    nombre                : '',
    descripcion           : '',
    creado_por_username   : '',
    categorias            : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idCategoria, nombre, descripcion, creado_por_username } = action.payload;
      state.idCategoria = idCategoria;
      state.nombre      = nombre;
      state.descripcion = descripcion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.categorias = action.payload.categorias;
    },
    resetFormularioStore:(state) => {
      state.idCategoria   = null;
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = categoriaStore.actions;