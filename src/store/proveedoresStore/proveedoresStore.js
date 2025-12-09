import { createSlice } from '@reduxjs/toolkit'

export const proveedoresStore = createSlice({
  name: 'proveedoresStore',
  initialState: {
    idProveedor           : null,
    nombre_empresa        : '',
    descripcion           : '',
    ciudad                :'',
    ruc                   : '',
    email                 : '',
    contacto_principal    : '',
    telefono              :'',
    direccion             : '',
    creado_por_username   : '',
    proveedores           : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idProveedor, nombre_empresa, descripcion, ciudad, ruc, email, contacto_principal, telefono, direccion, creado_por_username} = action.payload;
      
      state.idProveedor     = idProveedor;
      state.nombre_empresa  = nombre_empresa;
      state.descripcion     = descripcion;
      state.ciudad          = ciudad;

      state.ruc                 = ruc;
      state.email               = email;
      state.contacto_principal  = contacto_principal;
      state.telefono            = telefono;
      state.direccion           = direccion;
      state.creado_por_username = creado_por_username;
    },
    listStore:(state, action) => {
      state.proveedores = action.payload.proveedores;
    },
    resetFormularioStore:(state) => {
      state.idProveedor     = null;
      state.nombre_empresa  = '';
      state.descripcion     = '';
      state.ciudad          = '';

      state.ruc                 = '';
      state.email               = '';
      state.contacto_principal  = '';
      state.telefono            = '';
      state.direccion           = '';
      state.creado_por_username = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = proveedoresStore.actions;