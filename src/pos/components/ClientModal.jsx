import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Modal, Tabs, Tab, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import { Search as SearchIcon, People as PeopleIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk } from '../../store/posStore/posThunks.js';
import { createThunks as createThunksCliente, getAllThunks as getClientesThunk } from '../../store/clienteStore/clienteThunks.js';

export const ClientModal = ({ open, handleClose, currentClient }) => {
    const dispatch = useDispatch();

    const { clientes } = useSelector((state) => state.clientesStore);
    const { nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente } = useSelector((state) => state.posStore);

    const [tabIndex, setTabIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // 👉 Cargar más clientes al cambiar la página
    useEffect(() => {
    if (open) {
        setPage(1); // 🔄 Reinicia la paginación al abrir
        setLoading(true);
        dispatch(getClientesThunk({ page: 1 })).finally(() => setLoading(false));
    }
    }, [open, dispatch]);

    // Al cambiar de página (scroll infinito)
    useEffect(() => {
    if (page > 1 && clientes?.next) {
        setLoading(true);
        dispatch(getClientesThunk({ page })).finally(() => setLoading(false));
    }
    }, [page]);

    // 🔍 Filtro de búsqueda
    const filteredClients = useMemo(() => {
        if (!clientes?.results) return [];
        if (!searchTerm) return clientes.results;
        return clientes.results.filter((client) =>
            client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.id?.toString().includes(searchTerm)
        );
    }, [searchTerm, clientes]);

    const isFetching = useRef(false);

    const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (nearBottom && !isFetching.current && clientes?.next) {
        isFetching.current = true;
        setPage((prev) => prev + 1);
        setTimeout(() => (isFetching.current = false), 800);
    }
    };

    const selectClient = (client) => {
        dispatch(handleFormStoreThunk({ name: 'cliente_id', value: client }));
        handleClose();
    };

    const handleFormChange = (e) => {
        dispatch(handleFormStoreThunk({ name: e.target.name, value: e.target.value }));
    };

    const handleSaveAndSelect = () => {
        const dataCliente = {
            nombre: nombre_cliente,
            apellido: apellido_cliente,
            email: email_cliente,
            telefono: telefono_cliente,
            direccion: direccion_cliente,
        };

        dispatch(createThunksCliente(dataCliente));

        // Reset campos
        ['nombre_cliente', 'apellido_cliente', 'email_cliente', 'telefono_cliente', 'direccion_cliente'].forEach((campo) =>
            dispatch(handleFormStoreThunk({ name: campo, value: '' }))
        );

        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Buscar o Crear Cliente <PeopleIcon sx={{ ml: 1 }} />
                </Typography>

                <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} aria-label="Client Tabs" sx={{ mb: 2 }}>
                    <Tab label="Buscar Cliente" />
                    <Tab label="Nuevo/Editar" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box>
                        <TextField
                            fullWidth
                            label="Buscar por Nombre o ID"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{ endAdornment: <SearchIcon /> }}
                            sx={{ mb: 2 }}
                        />
                        <Paper
                            style={{ maxHeight: 250, overflow: 'auto' }}
                            onScroll={handleScroll}
                        >
                            <List dense>
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <ListItem key={client.id} button onClick={() => selectClient(client)}>
                                            <ListItemText
                                                primary={client.nombre}
                                                secondary={`ID: ${client.id} | Email: ${client.email || 'N/A'}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary="No se encontraron clientes."
                                            secondary="Intente una búsqueda diferente o cree uno nuevo."
                                        />
                                    </ListItem>
                                )}
                            </List>

                            {loading && (
                                <Box display="flex" justifyContent="center" p={1}>
                                    <CircularProgress size={22} />
                                </Box>
                            )}
                        </Paper>
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveAndSelect();
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Nombre/Razón Social"
                            name="nombre_cliente"
                            value={nombre_cliente}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Apellido"
                            name="apellido_cliente"
                            value={apellido_cliente}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Correo Electrónico (Opcional)"
                            name="email_cliente"
                            value={email_cliente}
                            onChange={handleFormChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Teléfono (Opcional)"
                            name="telefono_cliente"
                            value={telefono_cliente}
                            onChange={handleFormChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Dirección (Opcional)"
                            name="direccion_cliente"
                            value={direccion_cliente}
                            onChange={handleFormChange}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                            Guardar Nuevo Cliente
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};
