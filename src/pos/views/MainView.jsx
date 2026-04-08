import React, { useState, useMemo, useEffect } from 'react';
import { Grid, Box, Typography, Button, FormControl, Select, MenuItem, InputLabel, TextField, Tabs, Tab,
         Chip, IconButton, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';

import {  CatalogoProductos }   from '../components/CatalogoProductos.jsx';
import {  CatalogoCombos }      from '../components/CatalogoCombos.jsx';
import {  CartSummary       }   from '../components/CartSummary.jsx';
import { ClientModal }          from '../components/ClientModal.jsx';
import HeaderPOS                from '../components/HeaderPOS.jsx';

// --- MOCK DATA (DATOS SIMULADOS) ---
import { MOCK_CLIENTS_DB }  from '../data/ClientesData.jsx';
import { formatCurrency }   from '../constants/formatCurrency.js';

import { useSelector, useDispatch } from 'react-redux';
import { addToCartThunks, resetPosStoreThunk, createVentaThunk, getVentasThunk } from '../../store/posStore/posThunks.js';
import { addPago, removePago } from '../../store/posStore/posStore.js';
import { showAlert } from '../../store/globalStore/globalStore.js';
import { getAllThunks as getAllThunksClientes } from '../../store/clienteStore/clienteThunks.js';
import { getAllThunks as getAllTarjetas } from "../../store/tarjetasBancariasStore/tarjetasBancariasStoreThunks";
import { getCodigoVentaThunk } from "../../store/posStore/posThunks.js";
import FooterPOS from '../components/FooterPOS.jsx';

const METODOS_PAGO = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta Debito', label: 'Tarjeta de Debito' },
    { value: 'Tarjeta Credito', label: 'Tarjeta de Credito' },
    { value: 'Daviplata', label: 'Daviplata' },
    { value: 'Nequi', label: 'Nequi' },
    { value: 'Bancolombia', label: 'Bancolombia a la Mano' },
    { value: 'Transferencia', label: 'Transferencia Bancaria' },
];


const MainView = () => {
    const { currentCart, totals, pagos, cliente_id } = useSelector((state) => state.posStore);
    const { codigo_venta }    = useSelector((state) => state.posStore);
    const {tarjetas} = useSelector((state) => state.tarjetasBancariasStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentClient, setCurrentClient]         = useState(MOCK_CLIENTS_DB[0]);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [tabValue, setTabValue]                   = useState(0);

    // Estado local para el formulario de agregar pago
    const [nuevoMetodoPago, setNuevoMetodoPago]     = useState('Efectivo');
    const [nuevoMontoPago, setNuevoMontoPago]       = useState('');
    const [nuevoTarjetaId, setNuevoTarjetaId]       = useState('');

    useEffect(() => {
        dispatch( getCodigoVentaThunk() );
        dispatch(getAllTarjetas({ page: 1, pageSize: 100, search: "" }));
    }, [codigo_venta, dispatch]);

    const handleSetIsClientModalOpen = (isOpen) => {
        dispatch(getAllThunksClientes());
        setIsClientModalOpen(isOpen);
    }

    // Logica del Carrito
    const addToCart = (product) => {
        dispatch(addToCartThunks(product));
    }

    // Calcular monto restante por cubrir
    const totalPagado = useMemo(() => pagos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0), [pagos]);
    const montoRestante = useMemo(() => totals.total - totalPagado, [totals.total, totalPagado]);
    const cambioTotal = useMemo(() => montoRestante < 0 ? Math.abs(montoRestante) : 0, [montoRestante]);

    // Formatear monto con separador de miles mientras se escribe
    const handleMontoChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setNuevoMontoPago(raw);
    };

    const montoNumerico = parseFloat(nuevoMontoPago) || 0;
    const montoFormateado = nuevoMontoPago
        ? montoNumerico.toLocaleString('es-CO')
        : '';

    const handleAgregarPago = () => {
        if (!montoNumerico || montoNumerico <= 0) {
            dispatch(showAlert({ type: "warning", title: "Monto invalido", text: "Ingrese un monto mayor a 0." }));
            return;
        }
        if (montoRestante <= 0) {
            dispatch(showAlert({ type: "warning", title: "Total ya cubierto", text: "El total de la venta ya esta cubierto." }));
            return;
        }
        dispatch(addPago({
            metodo_pago: nuevoMetodoPago,
            monto: montoNumerico,
            tarjeta_id: nuevoTarjetaId || null,
        }));

        setNuevoMontoPago('');
        setNuevoTarjetaId('');
    };

    const handleRemovePago = (index) => {
        dispatch(removePago(index));
    };

    // Autocompletar monto restante
    const handleAutocompletarMonto = () => {
        if (montoRestante > 0) {
            setNuevoMontoPago(Math.round(montoRestante).toString());
        }
    };

    // Logica de Finalizacion de Venta
    const finalizeSale = () => {
        if (currentCart.length === 0) {
            dispatch(showAlert({
                type: "error",
                title: "Carrito vacio",
                text: "El carrito esta vacio. Agregue productos para finalizar la venta."
            }));
            return;
        }

        if (pagos.length === 0) {
            dispatch(showAlert({
                type: "warning",
                title: "Sin metodos de pago",
                text: "Debe agregar al menos un metodo de pago."
            }));
            return;
        }

        if (montoRestante > 0.99) {
            dispatch(showAlert({
                type: "warning",
                title: "Pago insuficiente",
                text: `Falta cubrir ${formatCurrency(montoRestante)} del total de la venta.`
            }));
            return;
        }

        const saleData = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            total: formatCurrency(totals.total),
            change: formatCurrency(cambioTotal),
            client: currentClient,
            pagos: pagos,
            items: currentCart,
        };

        // Construir HTML de pagos para el preview
        const pagosHtml = pagos.map(p => {
            const tarjeta = p.tarjeta_id ? tarjetas.find(t => t.id === p.tarjeta_id) : null;
            return `<tr>
                <td style="padding:6px 8px; border-bottom:1px solid #eee;">${p.metodo_pago}</td>
                <td style="padding:6px 8px; text-align:right; border-bottom:1px solid #eee; font-weight:bold;">${formatCurrency(p.monto)}</td>
                ${tarjeta ? `<td style="padding:6px 8px; border-bottom:1px solid #eee; font-size:12px; color:#666;">${tarjeta.nombre}</td>` : `<td style="padding:6px 8px; border-bottom:1px solid #eee;">-</td>`}
            </tr>`;
        }).join('');

        dispatch(showAlert({
            type: "info",
            title: "Verifique los Datos Antes de Confirmar",
            html: `
            <div style="
                font-family: 'Segoe UI', Roboto, sans-serif;
                background: #ffffff;
                padding: 25px;
                border-radius: 12px;
                color: #2c2c2c;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                width: 100%;
                max-width: 520px;
                margin: auto;
            ">
                <h2 style="margin: 0 0 10px 0; text-align: center; color: #262254; font-size: 22px;">
                    Verifique su Venta
                </h2>
                <p style="text-align:center; font-size:13px; color:#777; margin-bottom:15px;">
                    Antes de generar la venta, asegurese de que toda la informacion sea correcta.
                </p>
                <hr style="border: 1px solid #ddd; margin: 10px 0;">

                <div style="font-size:15px; line-height:1.6;">
                    <p><strong>ID Venta:</strong> ${codigo_venta}</p>
                    <p><strong>Cliente:</strong> ${saleData.client.name}</p>
                </div>

                <hr style="border: 1px solid #ddd; margin: 15px 0;">

                <table style="width:100%; border-collapse: collapse; font-size: 15px;">
                    <thead>
                        <tr style="background:#262254; color:white;">
                            <th style="padding:10px; text-align:left;">Producto</th>
                            <th style="padding:10px; text-align:center;">Cant.</th>
                            <th style="padding:10px; text-align:right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentCart
                            .map(
                                (item) => `
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #eee;">${item.nombre}</td>
                                    <td style="padding:8px; text-align:center; border-bottom:1px solid #eee;">${item.quantity}</td>
                                    <td style="padding:8px; text-align:right; border-bottom:1px solid #eee;">
                                        <strong>${formatCurrency(item.precio_final * item.quantity)}</strong>
                                    </td>
                                </tr>
                                `
                            )
                            .join("")}
                    </tbody>
                </table>

                <hr style="border: 1px solid #ddd; margin: 15px 0;">

                <h3 style="margin:0 0 8px 0; color:#262254; font-size:16px;">Metodos de Pago:</h3>
                <table style="width:100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="padding:8px; text-align:left;">Metodo</th>
                            <th style="padding:8px; text-align:right;">Monto</th>
                            <th style="padding:8px; text-align:left;">Cuenta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pagosHtml}
                    </tbody>
                </table>

                <hr style="border: 1px solid #ddd; margin: 15px 0;">

                <div style="text-align:right; font-size:17px; line-height:1.8;">
                    <p><strong>Total:</strong> <span style="color:#262254;">${saleData.total}</span></p>
                    <p><strong>Total Pagado:</strong> <span style="color:#262254;">${formatCurrency(totalPagado)}</span></p>
                    ${cambioTotal > 0 ? `
                    <p><strong>Cambio:</strong> <span style="color:#28a745;">${saleData.change}</span></p>
                    ` : ''}
                </div>

                <hr style="border: 1px solid #ddd; margin: 20px 0;">
                <p style="text-align:center; font-weight:600; color:#262254; font-size:16px; margin:0;">
                    Si todo esta correcto, confirme para continuar con la venta.
                </p>
            </div>
            `,
            confirmText: "Confirmar Venta",
            cancelText: "Cancelar",
            showCancel: true,
            action: () => {
                dispatch(createVentaThunk())
                dispatch(resetPosStoreThunk());
                dispatch(getVentasThunk());
            },
        }));
    };

    const handleFinalizarVenta = () => {
        finalizeSale();
    }

    const handleAnularVenta = () => {
        if (window.confirm('Esta seguro de anular la venta y vaciar el carrito?')) {
            dispatch(resetPosStoreThunk());
        }
    }


    return (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1200, bgcolor: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* === HEADER === */}
            <HeaderPOS
                codigoVenta={codigo_venta}
                currentClient={cliente_id?.id ? cliente_id : currentClient}
                onChangeClient={() => handleSetIsClientModalOpen(true)}
            />

            {/* === BODY === */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: { xs: 'auto', lg: 'hidden' } }}>
                <Grid container sx={{ height: { xs: 'auto', lg: '100%' }, minHeight: { xs: '100%', lg: 'auto' } }}>

                {/* COLUMNA 1: CATALOGO DE PRODUCTOS Y COMBOS */}
                <Grid item xs={12} lg={6} sx={{ height: { xs: 'auto', lg: '100%' }, minHeight: { xs: '60vh', lg: 'auto' } }}>
                    <Box sx={{ bgcolor: '#1e272e', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#1e272e', flexShrink: 0 }}>
                            <Tabs
                                value={tabValue}
                                onChange={(e, newValue) => setTabValue(newValue)}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: 'rgba(255,255,255,0.6)',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        minHeight: 48,
                                    },
                                    '& .Mui-selected': {
                                        color: '#fff !important',
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#c9a96e',
                                        height: 3,
                                    }
                                }}
                            >
                                <Tab label="Productos" />
                                <Tab label="Combos" />
                            </Tabs>
                        </Box>

                        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                            {tabValue === 0 && <CatalogoProductos addToCart={addToCart} />}
                            {tabValue === 1 && <CatalogoCombos addToCart={addToCart} />}
                        </Box>
                    </Box>
                </Grid>

                {/* COLUMNA 2: CARRITO Y CLIENTE */}
                <Grid item xs={12} sm={6} lg={3} sx={{ height: { xs: 'auto', lg: '100%' }, minHeight: { xs: '50vh', lg: 'auto' }, borderLeft: { lg: '1px solid #e0e0e0' } }}>
                    <CartSummary
                        currentClient={currentClient}
                        setCurrentClient={setCurrentClient}
                        openClientModal={() => handleSetIsClientModalOpen(true)}
                        totals={totals}
                    />
                </Grid>

                {/* COLUMNA 3: PANEL DE PAGOS MULTIPLES */}
                <Grid item xs={12} sm={6} lg={3} sx={{ bgcolor: '#f0f2f5', height: { xs: 'auto', lg: '100%' }, minHeight: { xs: '50vh', lg: 'auto' }, borderLeft: { lg: '1px solid #e0e0e0' } }}>
                    <Box sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 'bold', flexShrink: 0 }}>
                            Opciones de Pago
                        </Typography>

                        {/* Zona scrolleable: resumen + pagos + form */}
                        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
                        {/* Resumen del total y restante */}
                        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Total de la venta:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#262254' }}>
                                    {formatCurrency(totals.total)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Total cubierto:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                    {formatCurrency(totalPagado)}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {montoRestante > 0 ? 'Restante:' : 'Cambio:'}
                                </Typography>
                                <Typography variant="body1" sx={{
                                    fontWeight: 'bold',
                                    color: montoRestante > 0 ? '#e74c3c' : '#4caf50'
                                }}>
                                    {montoRestante > 0
                                        ? formatCurrency(montoRestante)
                                        : formatCurrency(cambioTotal)
                                    }
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Pagos agregados */}
                        {pagos.length > 0 && (
                            <Paper sx={{ p: 1.5, mb: 2, bgcolor: '#fff' }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>
                                    Pagos agregados:
                                </Typography>
                                {pagos.map((pago, index) => {
                                    const tarjeta = pago.tarjeta_id ? tarjetas.find(t => t.id === pago.tarjeta_id) : null;
                                    return (
                                        <Box key={index} sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            p: 1, mb: 0.5, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip label={pago.metodo_pago} size="small" color="primary" variant="outlined" />
                                                {tarjeta && <Typography variant="caption" color="text.secondary">{tarjeta.nombre}</Typography>}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {formatCurrency(pago.monto)}
                                                </Typography>
                                                <IconButton size="small" color="error" onClick={() => handleRemovePago(index)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Paper>
                        )}

                        {/* Formulario para agregar pago */}
                        {montoRestante > 0 && (
                            <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff', border: '2px dashed #90caf9' }}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#1565c0' }}>
                                    Agregar metodo de pago:
                                </Typography>

                                <FormControl fullWidth sx={{ mb: 1.5 }}>
                                    <InputLabel id="nuevo-metodo-label" size="small">Metodo de Pago</InputLabel>
                                    <Select
                                        labelId="nuevo-metodo-label"
                                        value={nuevoMetodoPago}
                                        label="Metodo de Pago"
                                        size="small"
                                        onChange={(e) => setNuevoMetodoPago(e.target.value)}
                                        sx={{ bgcolor: 'white' }}
                                    >
                                        {METODOS_PAGO.map((metodo) => (
                                            <MenuItem key={metodo.value} value={metodo.value}>
                                                {metodo.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ mb: 1.5 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Tarjeta / Cuenta"
                                        variant="outlined"
                                        size="small"
                                        value={nuevoTarjetaId}
                                        onChange={(e) => setNuevoTarjetaId(e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Sin tarjeta</em>
                                        </MenuItem>
                                        {tarjetas.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>

                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Monto"
                                        variant="outlined"
                                        size="small"
                                        value={montoFormateado}
                                        onChange={handleMontoChange}
                                        inputProps={{ inputMode: 'numeric' }}
                                    />
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={handleAutocompletarMonto}
                                        sx={{ minWidth: 'auto', whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                                    >
                                        Restante
                                    </Button>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<AddCircleIcon />}
                                    onClick={handleAgregarPago}
                                    sx={{ height: 42 }}
                                >
                                    Agregar Pago
                                </Button>
                            </Paper>
                        )}
                        </Box>
                        {/* Fin zona scrolleable */}

                        {/* Botones de Finalizacion (pegados al fondo) */}
                        <Box sx={{ flexShrink: 0, pt: 1.5, mt: 1, borderTop: '1px solid #e0e0e0' }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                fullWidth
                                onClick={handleFinalizarVenta}
                                disabled={
                                    currentCart.length === 0 ||
                                    pagos.length === 0 ||
                                    montoRestante > 0.99
                                }
                                sx={{ mb: 1, height: 56, fontWeight: 700 }}
                            >
                                Finalizar Venta
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                fullWidth
                                onClick={handleAnularVenta}
                            >
                                ANULAR VENTA
                            </Button>
                        </Box>

                    </Box>
                </Grid>
                </Grid>
            </Box>
            {/* === FIN BODY === */}

            {/* MODALS */}
            <ClientModal
                open={isClientModalOpen}
                handleClose={() => setIsClientModalOpen(false)}
                currentClient={currentClient}
            />
            <FooterPOS
                usuario="Sergio Dev"
                rol="Administrador"
                turno="Manana"
                totalVentas={1050000}
                totalProductos={32}
                estadoConexion={true}
                estadoImpresora={true}
                notificaciones={3}
                onDevolucion={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "Devolucion de producto",
                    text: "Funcionalidad de devolucion en desarrollo."
                    }))
                }
                onCambio={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "Cambio de producto",
                    text: "Funcionalidad de cambio de producto en desarrollo."
                    }))
                }
                onReporte={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "Reporte de ventas",
                    text: "Generando reporte de ventas..."
                    }))
                }
                onCerrarTurno={() =>
                    dispatch(showAlert({
                    type: "warning",
                    title: "Cerrar turno",
                    text: "Confirma el cierre del turno actual."
                    }))
                }
            />
        </Box>
    );
};
export { MainView };


