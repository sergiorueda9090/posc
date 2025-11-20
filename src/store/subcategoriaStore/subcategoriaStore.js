import { createSlice } from '@reduxjs/toolkit'

export const subcategoriaStore = createSlice({
  name: 'subcategoriaStore',
  initialState: {
    idSubcategoria           : null,
    categoria_id              : null,
    nombre                   : '',
    descripcion              : '',
    creado_por_username      : '',
    subcategorias            : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idSubcategoria, categoria_id, nombre, descripcion, creado_por_username } = action.payload;
      state.idSubcategoria  = idSubcategoria;
      state.categoria_id    = categoria_id;
      state.nombre          = nombre;
      state.descripcion     = descripcion;
      state.creado_por_username  = creado_por_username;
    },
    listStore:(state, action) => {
      state.subcategorias = action.payload.subcategorias;
    },
    resetFormularioStore:(state) => {
      state.idSubcategoria  = null;
      state.categoria_id   = null;
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = subcategoriaStore.actions;