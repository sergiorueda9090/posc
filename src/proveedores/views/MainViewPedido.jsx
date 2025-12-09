import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { resetFormularioStore } from '../../store/ordenPedidoStore/ordenPedidoStore';
import { showModalPedido } from '../../store/globalStore/globalStore';

import { useDispatch } from 'react-redux';

import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { FormDialogModalPedido } from '../components/FormDialogModalPedido';
import { DataTablePedidos } from '../components/DataTablePedidos';

import { getAllThunks }     from '../../store/proveedoresStore/proveedoresThunks';

const title = "Crear Orden de Pedido";

export const MainViewPedido = () => {
    const dispatch = useDispatch();
    
    const handleOpenModal = () => {
        dispatch(resetFormularioStore());
        dispatch(showModalPedido())
        dispatch( getAllThunks() );
    }
  
  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>
        <Grid item>
            <Typography fontSize={39} fontWeight="light">Órdenes de Pedido</Typography>
        </Grid>

        <Grid item>
            <Button color="primary" variant="outlined" onClick={ (e) => handleOpenModal() }>
                <AddShoppingCartIcon sx={{ fontSize:30, mr:1 }}/>
                 {title}
            </Button>
        </Grid>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            <DataTablePedidos/>
        </Grid>
        
        <FormDialogModalPedido />
        <SimpleBackdrop />
    </Grid>
  )
}