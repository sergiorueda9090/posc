import { useEffect }        from 'react';
import { Grid, Typography } from '@mui/material';
import Button               from '@mui/material/Button';
import PersonAddAltIcon     from '@mui/icons-material/PersonAddAlt';

import { DataTable }            from '../components/DataTable';
import { resetFormularioStore } from '../../store/subcategoriaStore/subcategoriaStore';
import { openModalShared }      from '../../store/globalStore/globalStore';

import { useDispatch } from 'react-redux';

import { SimpleBackdrop }  from "../../components/Backdrop/BackDrop";
import { FormDialogModal } from '../components/FormDialogModal';
import { getAllThunks as getAllCategorias }    from '../../store/categoriaStore/categoriaThunks';

const title = "Crear Subcategoria";

export const MainView = () => {

    const dispatch = useDispatch();
    
    const handleOpenModal = () => {
        dispatch(resetFormularioStore());
        dispatch(openModalShared())
        dispatch(getAllCategorias());
    }
  
  return (
    <Grid container direction="row" justifyContent="space-between" sx={{ mb:1 }} alignItems='center'>

        <Grid item>
            <Typography fontSize={39} fontWeight="light"> </Typography>
        </Grid>

        <Grid item>
            <Button color="primary" variant="outlined" onClick={ (e) => handleOpenModal() }>
                <PersonAddAltIcon sx={{ fontSize:30, mr:1 }}/>
                 {title}
            </Button>
        </Grid>

        <Grid container sx={{ mt:2, width:"99.99%" }}>
            <DataTable/>
        </Grid>
        
        {/* START MODAL */}
        <FormDialogModal />
        {/* END MODAL */}

        {/* START LOAD */}
        <SimpleBackdrop />
        {/* END LOAD */}


    </Grid>
  )
}
