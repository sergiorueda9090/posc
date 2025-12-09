import { createSlice } from '@reduxjs/toolkit'

export const utilidadOcasionalStore = createSlice({
  name: 'utilidadOcasionalStore',
  initialState: {
    idUtilidadOcasional   : null,
    tarjeta_id            : null,
    valor                 : 0,
    descripcion           : '',
    creado_por_username   : '',
    utilidadesOcasionales : [],
  },
  reducers: {
    showStore:(state,action) => {
      const { idUtilidadOcasional, tarjeta_id, valor, descripcion, creado_por_username } = action.payload;
      state.idUtilidadOcasional   = idUtilidadOcasional;
      state.tarjeta_id            = tarjeta_id;
      state.valor                 = valor;
      state.descripcion           = descripcion;
      state.creado_por_username   = creado_por_username;
    },
    listStore:(state, action) => {
      state.utilidadesOcasionales = action.payload.utilidadesOcasionales;
    },
    resetFormularioStore:(state) => {
      state.idUtilidadOcasional = null;
      state.tarjeta_id  = null;
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
export const { showStore, listStore, resetFormularioStore, handleFormStore } = utilidadOcasionalStore.actions;