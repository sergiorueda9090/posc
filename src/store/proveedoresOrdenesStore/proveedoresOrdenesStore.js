import { createSlice } from '@reduxjs/toolkit'

export const proveedoresOrdenesStore = createSlice({
  name: 'proveedoresOrdenesStore',
  initialState: {
    idOrden          : null,
    proveedor_id     : null,
    producto_id      : null,
    precio_compra    : null,
    producto_nombre  :  '',
    numero_orden     : '',
    estado           : 'pendiente',
    notas            : '',
    cantidad         :  0,
    detalles         : [],
    ordenes          : [],
    creado_por_username   : '',
    siguiente_numero_orden: null,
  },
  reducers: {
    showStore:(state,action) => {
      const { idOrden, proveedor_id, numero_orden, estado, notas, detalles, creado_por_username, cantidad } = action.payload;
      state.idOrden           = idOrden;
      state.proveedor_id      = proveedor_id;
      state.numero_orden     = numero_orden;
      state.estado           = estado;
      state.cantidad         = cantidad;
      state.notas            = notas;
      state.detalles         = detalles;
      state.creado_por_username = creado_por_username;
    },
    listStore:(state, action) => {
      state.ordenes = action.payload.ordenes;
    },
    setSiguienteNumeroOrden:(state, action) => {
      state.siguiente_numero_orden = action.payload.numero;
      state.numero_orden = action.payload.numero; // Lo asigna automáticamente
    },
    resetFormularioStore:(state) => {
      state.idOrden           = null;
      state.proveedor_id      = null;
      state.producto_id      = null;
      state.precio_compra     = null;
      state.producto_nombre   = '';
      state.numero_orden      = '';
      state.estado            = 'pendiente';
      state.notas             = '';
      state.cantidad          = 0;
      state.detalles          = [];
      state.creado_por_username = '';
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  }
})

// Action creators are generated for each case reducer function
export const { showStore, listStore, resetFormularioStore, handleFormStore, setSiguienteNumeroOrden } = proveedoresOrdenesStore.actions;