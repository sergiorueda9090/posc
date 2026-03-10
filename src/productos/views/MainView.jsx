import { useDispatch } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { DataTable } from '../components/DataTable';
import { resetFormularioStore } from '../../store/productoStore/productoStore';
import { openModalShared } from '../../store/globalStore/globalStore';
import { getAllThunks as getAllCategorias } from '../../store/categoriaStore/categoriaThunks';

import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { FormDialogModal } from '../components/FormDialogModal';

export const MainView = () => {

    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(resetFormularioStore());
        dispatch(openModalShared());
        dispatch(getAllCategorias());
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>

            {/* Header con boton crear */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexShrink: 0,
            }}>
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Productos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    sx={{ textTransform: 'none', px: 3 }}
                >
                    Crear producto
                </Button>
            </Box>

            {/* Tabla */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <DataTable />
            </Box>

            <FormDialogModal />
            <SimpleBackdrop />
        </Box>
    )
}
