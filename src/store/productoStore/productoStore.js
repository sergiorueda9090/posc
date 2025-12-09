import { createSlice } from '@reduxjs/toolkit'

export const productoStore = createSlice({
  name: 'productoStore',
  initialState: {
    id              : null,
    categoria_id    : null,
    subcategoria_id : null,
    proveedor_id    : null,
    nombre          : '',
    descripcion     : '',
    precio_compra   : '',
    precio_venta    : '',
    porcentaje_ganancia: '',
    total           : 0,
    unidad_medida   : '',
    codigo_busqueda : '',
    imagen          : '',
    genero          : '',
    cantidad        : 0,
    productos       : [],
  },
  reducers: {
    showStore:(state,action) => {
      const producto         = action.payload.producto;
      state.id               = producto.id;
      state.categoria_id     = producto.categoria_id;
      state.subcategoria_id  = producto.subcategoria_id;
      state.proveedor_id     = producto.proveedor_id;
      state.nombre           = producto.nombre;
      state.descripcion      = producto.descripcion;
      state.precio_compra    = producto.precio_compra;
      state.precio_venta     = producto.precio_final;
      state.porcentaje_ganancia = producto.porcentaje_ganancia;
      state.total            = producto.precio_final;
      state.codigo_busqueda  = producto.codigo_busqueda;
      state.unidad_medida    = producto.unidad_medida;
      state.imagen           = producto.imagen;
      state.genero           = producto.genero;
      state.cantidad         = producto.cantidad;
    },
    listStore:(state, action) => {
      state.productos = action.payload.productos;
    },
    resetFormularioStore:(state) => {
      state.id               = null;
      state.categoria_id     = null;
      state.subcategoria_id  = null;
      state.proveedor_id     = null;
      state.nombre           = '';
      state.descripcion      = '';
      state.precio_compra    = '';
      state.precio_venta     = '';
      state.porcentaje_ganancia = '';
      state.total            = 0;
      state.codigo_busqueda  = '';
      state.unidad_medida    = '';
      state.imagen           = '';
      state.genero           = '';
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