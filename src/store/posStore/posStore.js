import { createSlice } from '@reduxjs/toolkit'
import { TAX_RATE } from '../../pos/constants/TaxRage.js';

const calculateTotals = (cart) => {
  // 1. Subtotal de productos (sin descuentos)
  const taxableSubtotal = cart
    .filter(item => !item.isDiscount)
    .reduce((sum, item) => sum + (item.precio_final * item.quantity), 0);

  // 2. Suma total de descuentos
  const discountAmount = cart
    .filter(item => item.isDiscount)
    .reduce((sum, item) => sum + (item.precio_final * item.quantity), 0);

  // 3. Subtotal después de aplicar descuentos
  const subtotalAfterDiscount = taxableSubtotal + discountAmount;

  // 4. Impuesto sobre productos (no sobre descuentos)
  const taxValue = taxableSubtotal * TAX_RATE;

  // 5. Total final
  const total = subtotalAfterDiscount + taxValue;

  return {
    taxableSubtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxValue,
    total,
  };
};

export const posStore = createSlice({
  name: 'posStore',
  initialState: {
    id                     : null,
    currentCart            : [],
    cliente_id             : { id: null,
                               name: 'Público General',
                               email: '',
                               telefono: '',
                               direccion: ''
    },
    efectivo_recibido      : '0.00',
    total                  : 0,
    subTotal               : 0,
    impuesto               : 0,
    descuento              : 0,
    creado_por_username    : '',

    nombre_cliente         : '',
    apellido_cliente       : '',
    email_cliente          : '',
    telefono_cliente       : '',
    direccion_cliente      : '',

    totals                 : {
      subtotal              : 0,
      impuesto              : 0,
      descuento             : 0,
      total                 : 0,
    },
    ventas                  : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { id, currentCart, cliente_id, efectivo_recibido, impuesto, descuento, total, subTotal, creado_por_username } = action.payload;
      state.id                     = id;
      state.currentCart            = currentCart;
      state.cliente_id             = cliente_id;
      state.efectivo_recibido      = efectivo_recibido;
      state.impuesto               = impuesto;
      state.descuento              = descuento;
      state.total                  = total;
      state.subTotal               = subTotal;
      state.creado_por_username    = creado_por_username;
    },
    listStore:(state, action) => {
      state.currentCart = action.payload.currentCart;
    },
    listVentasStore:(state, action) => {
      state.ventas = action.payload.ventas;
    },
    resetFormularioStore:(state) => {
      state.id                     = null;
      state.currentCart            = [];
      state.cliente_id             = { id: null, name: 'Público General', email: '', telefono: '', direccion: '' };
      state.efectivo_recibido      = '0.00';
      state.impuesto               = 0;
      state.descuento              = 0;
      state.total                  = 0;
      state.subTotal               = 0;
      state.creado_por_username    = '';
      state.totals                 = {
        subtotal              : 0,
        impuesto              : 0,
        descuento             : 0,
        total                 : 0,
      };
      state.nombre_cliente         = '';
      state.apellido_cliente       = '';
      state.email_cliente          = '';
      state.telefono_cliente       = '';
      state.direccion_cliente      = '';
      state.ventas                 = [];
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    addToCart:(state, action) => {
      const productToAdd = action.payload;
      const existingItem = state.currentCart.find(item => item.nombre === productToAdd.nombre && !item.isDiscount);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.currentCart.push({ ...productToAdd, quantity: 1 });
      }
      state.currentCart = state.currentCart.filter(item => item.quantity > 0);

      state.totals = calculateTotals(state.currentCart);


    },
    updateQuantity:(state, action) => {
      
      const { item, delta } = action.payload;

      const itemToUpdate = state.currentCart.find(itemCart => itemCart.id == item.id);

      if (itemToUpdate) {
    
        itemToUpdate.quantity += delta;
       
        if (itemToUpdate.quantity < 1) {
          itemToUpdate.quantity = 1; // Evitar cantidades negativas o cero
        }
    
      }
  
      state.currentCart = state.currentCart.filter(i => i.quantity > 0);
      state.totals = calculateTotals(state.currentCart);
    
    },
    removeItem:(state, action) => {
      const itemToRemove = action.payload;
      state.currentCart = state.currentCart.filter(item => item.id !== itemToRemove.id);
      state.totals = calculateTotals(state.currentCart);

    },
  },
});

// Action creators are generated for each case reducer function
export const { showStore, listStore, listVentasStore, resetFormularioStore, handleFormStore,
              addToCart, updateQuantity, removeItem } = posStore.actions;