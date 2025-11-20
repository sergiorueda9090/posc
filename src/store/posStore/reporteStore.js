import { createSlice } from '@reduxjs/toolkit'

export const reporteStore = createSlice({
  name: 'reporteStore',
  initialState: {
    resumen_general : {},
  },
  reducers: {
    showStore:(state,action) => {
      state.resumen_general = action.payload;
    },
    listStore:(state, action) => {
      state.resumen_general = action.payload.resumen_general;
    },
    handleFormStore:(state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetFormularioStore:(state) => {
      state.resumen_general = {};
    }
  },
});

// Action creators are generated for each case reducer function
export const {showStore,listStore,handleFormStore,resetFormularioStore} = reporteStore.actions;