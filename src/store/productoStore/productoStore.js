import { createSlice } from '@reduxjs/toolkit'



export const productoStore = createSlice({
  name: 'productoStore',
  initialState: {
    id              : null,
    categoria_id    : null,
    subcategoria_id : null,
    nombre          : '',
    descripcion     : '',
    precio_compra   : '',
    porcentaje_ganancia: '',
    total           : 0,
    codigo_busqueda : '',
    imagen          : '',
    cantidad        : 0,
    productos       : [],
  },
  reducers: {
    showStore:(state,action) => {
      const producto         = action.payload.producto;
      state.id               = producto.id;
      state.categoria_id     = producto.categoria_id;
      state.subcategoria_id  = producto.subcategoria_id;
      state.nombre           = producto.nombre;
      state.descripcion      = producto.descripcion;
      state.precio_compra    = producto.precio_compra;
      state.porcentaje_ganancia = producto.porcentaje_ganancia;
      state.total            = producto.total;
      state.codigo_busqueda  = producto.codigo_busqueda;
      state.imagen           = producto.imagen;
      state.cantidad         = producto.cantidad;
    },
    listStore:(state, action) => {
      state.productos = action.payload.productos;
    },
    resetFormularioStore:(state) => {
      state.id               = null;
      state.categoria_id     = null;
      state.subcategoria_id  = null;
      state.nombre           = '';
      state.descripcion      = '';
      state.precio_compra    = '';
      state.porcentaje_ganancia = '';
      state.total            = 0;
      state.codigo_busqueda  = '';
      state.imagen           = '';
      state.cantidad         = 0;
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore } = productoStore.actions;