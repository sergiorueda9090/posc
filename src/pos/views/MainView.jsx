import React, { useState, useMemo } from 'react';
import { Container, Grid, Box, Typography, Button} from '@mui/material';

import {  CatalogoProductos }   from '../components/CatalogoProductos.jsx';
import {  CartSummary       }   from '../components/CartSummary.jsx';
import { ClientModal }          from '../components/ClientModal.jsx';
import { Numpad }               from '../components/Numpad.jsx';
import { CardPaymentModal }     from '../components/CardPaymentModal.jsx';
import { calculateTotals }      from '../components/calculateTotals.jsx';

// --- MOCK DATA (DATOS SIMULADOS) ---
import { MOCK_CLIENTS_DB }  from '../data/ClientesData.jsx';
import { formatCurrency }   from '../constants/formatCurrency.js';

import { useSelector, useDispatch } from 'react-redux';
import { addToCartThunks, resetPosStoreThunk, handleFormStoreThunk, createVentaThunk, getVentasThunk } from '../../store/posStore/posThunks.js';
import { showAlert } from '../../store/globalStore/globalStore.js';
import { getAllThunks as getAllThunksClientes } from '../../store/clienteStore/clienteThunks.js';
import FooterPOS from '../components/FooterPOS.jsx';

const MainView = () => {
    const { currentCart, efectivo_recibido, totals } = useSelector((state) => state.posStore);
    const dispatch = useDispatch();

    const [currentClient, setCurrentClient]         = useState(MOCK_CLIENTS_DB[0]);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen]     = useState(false);

    const handleSetIsClientModalOpen = (isOpen) => {
        dispatch(getAllThunksClientes());
        setIsClientModalOpen(isOpen);
    }

    // Lógica del Carrito
    const addToCart = (product) => {
        dispatch(addToCartThunks(product));
    }

    // Lógica de Finalización de Venta
    const finalizeSale = (paymentMethod) => {
        if (currentCart.length === 0) {
            dispatch(showAlert({
                type: "error",
                title: "Carrito vacío",
                text: "El carrito está vacío. Agregue productos para finalizar la venta."
            }));
            return;
        }

        const total = totals.total;
        const received = paymentMethod === 'Efectivo' ? (parseFloat(efectivo_recibido) || 0) : total;
        const change = received - total;

        if (paymentMethod === 'Efectivo' && change < 0) {
            dispatch(showAlert({
                type: "warning",
                title: "⚠️ Pago Insuficiente",
                text: `El monto recibido es insuficiente. Faltan ${formatCurrency(Math.abs(change))}.`
            }));
            return;
        }

        const saleData = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            total: formatCurrency(total),
            received: formatCurrency(received),
            change: formatCurrency(Math.abs(change)),
            client: currentClient,
            method: paymentMethod,
            items: currentCart,
        };

        // 🧾 Mostrar vista previa de la venta antes de confirmar
        dispatch(showAlert({
            type: "info",
            title: "🧐 Verifique los Datos Antes de Confirmar",
            html: `
            <div style="
                font-family: 'Segoe UI', Roboto, sans-serif;
                background: #ffffff;
                padding: 25px;
                border-radius: 12px;
                color: #2c2c2c;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                width: 100%;
                max-width: 480px;
                margin: auto;
            ">
                <h2 style="
                    margin: 0 0 10px 0; 
                    text-align: center; 
                    color: #262254; 
                    font-size: 22px;
                    letter-spacing: 0.5px;
                ">
                    🧾 Verifique su Venta
                </h2>
                <p style="text-align:center; font-size:13px; color:#777; margin-bottom:15px;">
                    Antes de generar la venta, asegúrese de que toda la información sea correcta.
                </p>
                <hr style="border: 1px solid #ddd; margin: 10px 0;">

                <div style="font-size:15px; line-height:1.6;">
                    <p><strong>ID Venta:</strong> ${saleData.id}</p>
                    <p><strong>Cliente:</strong> ${saleData.client.name} <span style="color:#666;">(ID: ${saleData.client.id})</span></p>
                    <p><strong>Método de pago:</strong> ${saleData.method}</p>
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

                <div style="text-align:right; font-size:17px; line-height:1.8;">
                    <p><strong>Total:</strong> <span style="color:#262254;">${saleData.total}</span></p>
                    <p><strong>Recibido:</strong> <span style="color:#262254;">${saleData.received}</span></p>
                    <p><strong>Cambio:</strong> <span style="color:#28a745;">${saleData.change}</span></p>
                </div>

                <hr style="border: 1px solid #ddd; margin: 20px 0;">
                <p style="
                    text-align:center; 
                    font-weight:600; 
                    color:#262254; 
                    font-size:16px; 
                    margin:0;
                ">
                    Si todo está correcto, confirme para continuar con la venta.
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
                setIsCardModalOpen(false);
                dispatch(showAlert({
                    type: "success",
                    title: "✅ Venta Generada Correctamente",
                    text: "La venta se ha completado y el sistema ha sido reiniciado."
                }));
            },
        }));
    };


    const handleCashPayment = () => finalizeSale('Efectivo');
    const handleCardPaymentFinalize = () => finalizeSale('Tarjeta');
    const handleAnularVenta = () => {
        if (window.confirm('¿Está seguro de anular la venta y vaciar el carrito?')) {
            dispatch(resetPosStoreThunk());
            dispatch(handleFormStoreThunk({name: 'efectivo_recibido', value: '0.00'}));
        }
    }


    return (
        <Container maxWidth={false} sx={{ height: '100vh', p: 0 }}>
            <Grid container sx={{ height: '100%' }}>
                
                {/* COLUMNA 1: CATÁLOGO DE PRODUCTOS (6 unidades) */}
                <Grid item xs={12} lg={6}>
                    <CatalogoProductos addToCart={addToCart} />
                </Grid>

                {/* COLUMNA 2: CARRITO Y CLIENTE (3 unidades) */}
                <Grid item xs={12} sm={6} lg={3}>
                    <CartSummary 
                        currentClient={currentClient}
                        setCurrentClient={setCurrentClient}
                        openClientModal={() => handleSetIsClientModalOpen(true)}
                        totals={totals}
                    />
                </Grid>

                {/* COLUMNA 3: PANEL DE PAGO Y TECLADO (3 unidades) */}
                <Grid item xs={12} sm={6} lg={3} sx={{ bgcolor: '#f0f2f5' }}>
                    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Opciones de Pago 💳
                        </Typography>
                        
                        {/* Botones de Finalización */}
                        <Button 
                            variant="contained" 
                            color="success" 
                            size="large" 
                            fullWidth 
                            onClick={handleCashPayment} 
                            disabled={currentCart.length === 0 || totals.total > parseFloat(efectivo_recibido)}
                            sx={{ mb: 1, height: 60 }}
                        >
                            Finalizar Venta (Efectivo)
                        </Button>
                        {/*<Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth 
                            onClick={() => setIsCardModalOpen(true)} 
                            disabled={currentCart.length === 0}
                            sx={{ mb: 3, height: 60 }}
                        >
                            Pagar con Tarjeta
                        </Button>*/}
                        <Button 
                            variant="outlined" 
                            color="error" 
                            size="small" 
                            fullWidth 
                            onClick={handleAnularVenta}
                            sx={{ mb: 3 }}
                        >
                            ANULAR VENTA
                        </Button>

                        <Numpad totals={totals} />
                    </Box>
                </Grid>
            </Grid>

            {/* MODALS */}
            <ClientModal 
                open={isClientModalOpen} 
                handleClose={() => setIsClientModalOpen(false)} 
                currentClient={currentClient}
            />
            <CardPaymentModal
                open={isCardModalOpen}
                handleClose={() => setIsCardModalOpen(false)}
                total={totals.total}
                onFinalize={handleCardPaymentFinalize}
            />
            <br></br><br></br>
            <FooterPOS
                usuario="Sergio Dev"
                rol="Administrador"
                turno="Mañana"
                totalVentas={1050000}
                totalProductos={32}
                estadoConexion={true}
                estadoImpresora={true}
                notificaciones={3}
                onDevolucion={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "🔄 Devolución de producto",
                    text: "Funcionalidad de devolución en desarrollo."
                    }))
                }
                onCambio={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "♻️ Cambio de producto",
                    text: "Funcionalidad de cambio de producto en desarrollo."
                    }))
                }
                onReporte={() =>
                    dispatch(showAlert({
                    type: "info",
                    title: "📊 Reporte de ventas",
                    text: "Generando reporte de ventas..."
                    }))
                }
                onCerrarTurno={() =>
                    dispatch(showAlert({
                    type: "warning",
                    title: "🚪 Cerrar turno",
                    text: "Confirma el cierre del turno actual."
                    }))
                }
            />

            
        </Container>
    );
};
export { MainView };


