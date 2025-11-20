import React, { useState, useMemo } from 'react';
import {  Box, Typography, Button, TextField, Modal,  Alert} from '@mui/material';
import { Payment as PaymentIcon,} from '@mui/icons-material';
import { formatCurrency } from '../constants/formatCurrency.js';

export const CardPaymentModal = ({ open, handleClose, total, onFinalize }) => (
    <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Pago con Tarjeta <PaymentIcon sx={{ ml: 1 }} />
            </Typography>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 2 }}>
                TOTAL: {formatCurrency(total)}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
                Simulación: Conexión con Terminal de Tarjetas.
            </Alert>
            <TextField 
                fullWidth 
                label="Número de Tarjeta (Simulado)" 
                variant="outlined" 
                sx={{ mb: 3 }} 
            />
            <Button variant="contained" color="primary" fullWidth onClick={() => onFinalize('Tarjeta')}>
                Procesar Pago
            </Button>
        </Box>
    </Modal>
);