import { createSlice } from '@reduxjs/toolkit'

export const comboStore = createSlice({
  name: 'comboStore',
  initialState: {
    id              : null,
    nombre          : '',
    activo          : true,
    precio_total    : 0,
    productos       : [],
    combos          : [],
    combosActivos   : [],
  },
  reducers: {
    showStore:(state, action) => {
      const combo = action.payload.combo;
      state.id            = combo.id;
      state.nombre        = combo.nombre;
      state.activo        = combo.activo;
      state.precio_total  = combo.precio_total;
      state.productos     = combo.productos || [];
    },
    listStore:(state, action) => {
      state.combos = action.payload.combos;
    },
    listActivosStore:(state, action) => {
      state.combosActivos = action.payload.combosActivos;
    },
    resetFormularioStore:(state) => {
      state.id            = null;
      state.nombre        = '';
      state.activo        = true;
      state.precio_total  = 0;
      state.productos     = [];
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    addProductoToComboStore:(state, action) => {
      const producto = action.payload;
      state.productos.push(producto);
      // Recalcular precio total
      state.precio_total = state.productos.reduce(
        (sum, p) => sum + (p.precio_combo * p.cantidad), 0
      );
    },
    removeProductoFromComboStore:(state, action) => {
      const productoId = action.payload.id;
      state.productos = state.productos.filter(p => p.id !== productoId);
      // Recalcular precio total
      state.precio_total = state.productos.reduce(
        (sum, p) => sum + (p.precio_combo * p.cantidad), 0
      );
    },
    updateProductoInComboStore:(state, action) => {
      const { id, precio_combo, cantidad } = action.payload;
      const producto = state.productos.find(p => p.id === id);
      if (producto) {
        producto.precio_combo = precio_combo;
        producto.cantidad = cantidad;
      }
      // Recalcular precio total
      state.precio_total = state.productos.reduce(
        (sum, p) => sum + (p.precio_combo * p.cantidad), 0
      );
    },
  }
})

export const {
  showStore,
  listStore,
  listActivosStore,
  resetFormularioStore,
  handleFormStore,
  addProductoToComboStore,
  removeProductoFromComboStore,
  updateProductoInComboStore,
} = comboStore.actions;
