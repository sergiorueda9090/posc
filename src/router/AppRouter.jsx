import { Route, Routes, Navigate }      from 'react-router-dom';
import { useSelector  }                 from 'react-redux';
import { AuthRoutes }                   from '../auth/routes/AuthRoutes';
import { JournalRoutes }                from '../journal/routes/JournalRoutes';

import { UsersPage }                    from '../usuarios/pages/UsersPage';  
import { MainPage as Clientes }         from '../clientes/pages/MainPage';
import { MainPage as Categoria }        from '../categoria/pages/MainPage';
import { MainPage as Subcategoria }     from '../subcategoria/pages/MainPage';
import { MainPage as Productos }        from '../productos/pages/MainPage';
import { MainRoutes as PosRoutes }      from "../pos/routes/MainRoutes";
import { MainPage as Gastos }           from '../gastos/pages/MainPage';
import { MainPage as RelacionGastos }   from '../relacionarGastos/pages/MainPage';
import { MainPage as TarjetasBancarias }  from '../tarjetasBancarias/pages/MainPage';
import { MainPage as RecepcionPagos }   from '../recepcionPagos/pages/MainPage';
import { MainPage as CargosNoRegistrados }   from '../cargosNoRegistrados/pages/MainPage';
import { MainPage as AjusteDeSaldo }   from '../ajusteDeSaldo/pages/MainPage';
import { MainPage as UtilidadOcasional } from '../utilidadOcasional/pages/MainPage';
import { MainPage as Proveedores } from '../proveedores/pages/MainPage';

export const AppRouter = () => {
 
  const data = useSelector(state => state.authStore);
  
  return (
    <Routes>
            {data.isLogin ? (
              <>
                <Route path="/*"                element={ <JournalRoutes /> } />
                <Route path="/users"            element={ <UsersPage /> } />
                <Route path="/clientes"         element={ <Clientes /> } />
                <Route path="/categorias"       element={ <Categoria /> } />
                <Route path="/subcategorias"    element={ <Subcategoria /> } />
                <Route path="/productos"        element={ <Productos /> } />
                <Route path="/pos/*"            element={<PosRoutes />} />
                <Route path="/gastos"           element={ <Gastos /> } />
                <Route path="/relacionargastos" element={ <RelacionGastos /> } />
                <Route path="/tarjetasbancarias" element={ <TarjetasBancarias /> } />
                <Route path="/recepcionpagos"   element={ <RecepcionPagos /> } />
                <Route path="/cargosnoregistrados"   element={ <CargosNoRegistrados /> } />
                <Route path="/ajustedesaldo"   element={ <AjusteDeSaldo /> } />
                <Route path="/utilidadocasional"   element={ <UtilidadOcasional /> } />
                <Route path="/proveedores"   element={ <Proveedores /> } />

              </>
              ) : (
                <>
                  <Route path="/auth/*"   element={ <AuthRoutes /> } />
                  <Route path="*"         element={<Navigate to="/auth" replace />} />
                </>
            )
          
        }
      </Routes>
  )
}