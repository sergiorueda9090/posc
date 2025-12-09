import { createSlice } from '@reduxjs/toolkit'

export const globalStore = createSlice({
  name: 'globalStore',
  initialState: {
    openBackDropStore   : false,
    openModalStore      : false,
    openLinearProgress  : false,
    alert               : null,
    startDate           : '',
    endDate             : '',
    searchQuery         : '',
    openModalExcel      : false,
    openModalCantidad   : false,
    openModalPedido     : false,
  },
  reducers: {
    showBackDropStore:(state) => {
      state.openBackDropStore = true
    },
    hideBackDropStore:(state) => {
      state.openBackDropStore = false
    },
    openModalShared:(state, action) => {
        state.openModalStore = true;
    },
    closeModalShared:(state, action) => {
        state.openModalStore    = false;
    },
    openModalExcel:(state, action) => {
      state.openModalExcel = true;
    },
    closeModalExcel:(state, action) => {
      state.openModalExcel = false;
    },
    showModalCantidad:(state, action) => {
        state.openModalCantidad = true;
    },
    hideModalCantidad:(state, action) => {
        state.openModalCantidad = false;
    },
    showModalPedido:(state, action) => {
      state.openModalPedido = true;
    },
    hideModalPedido:(state, action) => {
      state.openModalPedido = false;
    },
    showLinearProgress:(state, action) => {
      state.openLinearProgress = true;
    },
    hideLinearProgress:(state, action) => {
      state.openLinearProgress = false;
    },
    startDateGlobalStore: (state, action) => {
      state.startDate = action.payload
    },
    endDateGlobalStore: (state, action) => {
      state.endDate   = action.payload
    },
    searchQueryGlobalStore: (state, action) => {
      console.log("action.payload.searchQuery:", action.payload.searchQuery);
      state.searchQuery = action.payload.searchQuery
    },
    showAlert: (state, action) => {
      state.alert = action.payload; // { type, title, text, confirmText, action }
    },
    clearAlert: (state) => {
      state.alert = null;
    },
  }
})

// Action creators are generated for each case reducer function
export const { showBackDropStore,      hideBackDropStore, openModalShared, 
                closeModalShared,      showLinearProgress, showModalCantidad,     
                hideModalCantidad,    hideLinearProgress, startDateGlobalStore,  
                endDateGlobalStore,    closeModalExcel,       openModalExcel, 
                showAlert, clearAlert, searchQueryGlobalStore, showModalPedido, hideModalPedido } = globalStore.actions;