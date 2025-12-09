import React, { useState, useMemo } from 'react';
import {Box, Typography, Button, TextField, Divider, Modal, Paper} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Discount as DiscountIcon, People as PeopleIcon,} from '@mui/icons-material';


import { CartItem }       from './CartItem.jsx';
import { formatCurrency } from '../constants/formatCurrency.js';

import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '../../store/globalStore/globalStore.js';
import { addToCartThunks, resetPosStoreThunk } from '../../store/posStore/posThunks.js';


export const CartSummary = ({ currentClient, openClientModal, totals }) => {

    const dispatch = useDispatch();

    const { currentCart, cliente_id } = useSelector((state) => state.posStore);
    console.log(" ===== cliente_id ==== ", cliente_id );
    // Función para manejar el descuento del Modal (simulada)
    const handleApplyDiscount = (value, type) => {
        const preTaxTotal = currentCart.filter(item => !item.isDiscount).reduce((sum, item) => sum + (item.precio_final * item.quantity), 0);
        let discountAmount = 0;

        if (isNaN(value) || value <= 0) { 
            dispatch(
                showAlert({
                    type: "warning",
                    title: "⚠️ Valor Inválido",
                    text: "Por favor, ingrese un valor de descuento válido. 💰",
                })
            );
            return;
        }
        
        // Remover cualquier descuento existente
        dispatch(resetPosStoreThunk());

        if (type === 'percent') {
            if (value > 100){ 
                dispatch(
                    showAlert({
                        type: "warning",
                        title: "⚠️ Valor Inválido",
                        text: "El porcentaje de descuento no puede ser mayor al 100%. 💰",
                    })
                );
                return; 
            }
            discountAmount = -(preTaxTotal * (value / 100));
            dispatch(addToCartThunks({ name: `Descuento (${value}%)`, price: discountAmount, quantity: 1, isDiscount: true }));

        } else { // type === 'amount'
            if (value > preTaxTotal) { 
                dispatch(
                    showAlert({
                        type: "warning",
                        title: "⚠️ Valor Inválido",
                        text: "El monto del descuento no puede ser mayor al total de los productos. 💰",
                    })
                );
                return; 
            }
            discountAmount = -value;
            dispatch(addToCartThunks({ name: `Descuento ($${value.toFixed(2)})`, price: discountAmount, quantity: 1, isDiscount: true }));
        }
    };
    
    const handleRemoveDiscount = () => {
        dispatch(resetPosStoreThunk());
    };

    // Modal de Descuento
    const DiscountModal = ({ open, handleClose, onApply }) => {
        const [value, setValue] = useState(0);
        const [type, setType] = useState('amount');

        return (
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Aplicar Descuento <DiscountIcon /></Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>Total Productos: {formatCurrency(totals.taxableSubtotal)}</Typography>
                    <TextField
                        fullWidth
                        label="Valor del Descuento"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                        InputProps={{ startAdornment: type === 'amount' ? '$' : '%' }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        fullWidth
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ mb: 3 }}
                    >
                        <option value="amount">Monto Fijo ($)</option>
                        <option value="percent">Porcentaje (%)</option>
                    </TextField>
                    <Button variant="contained" color="success" fullWidth onClick={() => { onApply(value, type); handleClose(); }}>
                        Aplicar Descuento
                    </Button>
                </Box>
            </Modal>
        );
    };

    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

    return (
        <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                Carrito de Venta <ShoppingCartIcon sx={{ ml: 1 }} />
            </Typography>

            {/* Panel de Cliente */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Cliente Actual:</Typography>
                    <Button size="small" onClick={openClientModal} startIcon={<PeopleIcon />}>
                        Buscar/Cambiar
                    </Button>
                </Box>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 'medium' }}>{cliente_id.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">ID: {cliente_id.id}</Typography>
            </Paper>

            {/* Lista de Ítems */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, border: '1px solid #ccc', borderRadius: 1, mb: 2, backgroundColor: '#f9f9f9' }}>
                {currentCart.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                        El carrito está vacío.
                    </Typography>
                ) : (
                    currentCart.map((item, index) => (
                        <CartItem 
                            key={item.nombre + index} 
                            item={item}
                        />
                    ))
                )}
            </Box>

            {/* Resumen de Totales */}
            <Box sx={{ p: 2, border: '1px solid primary.main', borderRadius: 2, mt: 'auto', backgroundColor: '#e3f2fd' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(totals.subtotalAfterDiscount)}</Typography>
                </Box>
                {/*<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Impuestos (16%):</Typography>
                    <Typography>{formatCurrency(totals.taxValue)}</Typography>
                </Box>*/}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>TOTAL:</Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>{formatCurrency(totals.total)}</Typography>
                </Box>
            </Box>
            
            {/* Botones de Descuento y Anular 
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2 }}>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    onClick={() => setIsDiscountModalOpen(true)}
                    startIcon={<DiscountIcon />}
                >
                    Descuento
                </Button>
                {currentCart.some(item => item.isDiscount) && (
                     <Button 
                        variant="outlined" 
                        color="warning" 
                        fullWidth
                        onClick={handleRemoveDiscount}
                    >
                        Quitar Desc.
                    </Button>
                )}
            </Box>*/}

            <DiscountModal 
                open={isDiscountModalOpen} 
                handleClose={() => setIsDiscountModalOpen(false)} 
                onApply={handleApplyDiscount}
            />
        </Box>
    );
};