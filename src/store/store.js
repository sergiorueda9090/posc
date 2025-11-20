import { configureStore } from '@reduxjs/toolkit'
import { authStore }      from './authStore/authStore';
import { globalStore }    from './globalStore/globalStore';
import { usersStore }     from './usersStore/usersStore';
import { clientesStore } from './clienteStore/clienteStore';
import { categoriaStore } from './categoriaStore/categoriaStore';
import { subcategoriaStore } from './subcategoriaStore/subcategoriaStore';
import { productoStore } from './productoStore/productoStore';
import { posStore } from './posStore/posStore';
import { reporteStore } from './posStore/reporteStore';
import { inventarioProductoStore } from './inventarioProductoStore/inventarioProductoStore';
import {  devolucionesStore } from './posStore/devolucionesStore';
import { gastoStore }     from './gastoStore/gastoStore';
import { relacionarGastoStore } from './relacionarGastoStore/relacionarGastoStore';
import { tarjetasBancariasStore } from './tarjetasBancariasStore/tarjetasBancariasStore';
import { recepcionPagosStore } from './recepcionPagosStore/recepcionPagosStore';
import { cargosNoRegistradosStore } from './cargosNoRegistradosStore/cargosNoRegistradosStore';

export const store = configureStore({
  reducer: {
    authStore             : authStore.reducer,
    globalStore           : globalStore.reducer,
    usersStore            : usersStore.reducer,
    clientesStore         : clientesStore.reducer,
    categoriaStore        : categoriaStore.reducer,
    subcategoriaStore     : subcategoriaStore.reducer,
    productoStore         : productoStore.reducer,
    posStore              : posStore.reducer,
    reporteStore          : reporteStore.reducer,
    inventarioProductoStore: inventarioProductoStore.reducer,
    devolucionesStore     : devolucionesStore.reducer,
    gastoStore            : gastoStore.reducer,
    relacionarGastoStore  : relacionarGastoStore.reducer,
    tarjetasBancariasStore: tarjetasBancariasStore.reducer,
    recepcionPagosStore   : recepcionPagosStore.reducer,
    cargosNoRegistradosStore   : cargosNoRegistradosStore.reducer,
  }
})
