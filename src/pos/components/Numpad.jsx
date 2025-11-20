import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, TextField, Divider, Paper } from '@mui/material';
import { formatCurrency } from '../constants/formatCurrency.js';
import { handleFormStoreThunk } from '../../store/posStore/posThunks.js';
import { useDispatch, useSelector } from 'react-redux';

export const Numpad = ({ totals }) => {
    const dispatch = useDispatch();

    const { efectivo_recibido } = useSelector(state => state.posStore);

    const totalToPay = totals.total;
    const received   = parseFloat(efectivo_recibido) || 0;
    const change     = received - totalToPay;

    const handleNumpadInput = (value) => {
        let current = efectivo_recibido.toString();

        if (value === 'C') {
            dispatch(handleFormStoreThunk({name: 'efectivo_recibido', value: '0.00'}));
            return;
        }

        if (value === 'DEL' || value === 'Backspace') {
            if (current.length > 1) {
                current = current.replace('.', '');
                current = current.slice(0, -1);
                if (current.length > 2) {
                    current = current.slice(0, -2) + '.' + current.slice(-2);
                } else if (current.length === 2) {
                    current = '0.' + current;
                } else {
                    current = '0.0' + current;
                }
            } else {
                current = '0.00';
            }
            dispatch(handleFormStoreThunk({name: 'efectivo_recibido', value: parseFloat(current).toFixed(2)}));
            return;
        }

        if (value === '.') {
            if (!current.includes('.')) {
                dispatch(handleFormStoreThunk({name: 'efectivo_recibido', value: current + '.'}));
            }
            return;
        }

        if (!/^\d+$/.test(value)) return;

        let cleaned = current.replace('.', '');
        if (cleaned === '000') cleaned = '';
        cleaned += value;

        if (cleaned.length > 11) return; // límite de dígitos

        if (cleaned.length > 2) {
            cleaned = cleaned.slice(0, -2) + '.' + cleaned.slice(-2);
        } else if (cleaned.length === 2) {
            cleaned = '0.' + cleaned;
        } else {
            cleaned = '0.0' + cleaned;
        }
        dispatch(handleFormStoreThunk({name: 'efectivo_recibido', value: parseFloat(cleaned).toFixed(2)}));
    };

    //Detectar entrada desde el teclado físico
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;

            if (/^\d$/.test(key)) {
                handleNumpadInput(key);
            } else if (key === '.' || key === ',') {
                handleNumpadInput('.');
            } else if (key === 'Backspace') {
                handleNumpadInput('DEL');
            } else if (key.toLowerCase() === 'c') {
                handleNumpadInput('C');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [efectivo_recibido]);

    const numpadButtons = [
        '1', '2', '3', 'DEL',
        '4', '5', '6', 'C',
        '7', '8', '9', '00',
        '.', '0',
    ];

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                mt: 2,
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                userSelect: 'none',
            }}
        >
            <Typography variant="h6" gutterBottom>Efectivo Recibido</Typography>

            <TextField
                fullWidth
                name="efectivo_recibido"
                variant="outlined"
                value={formatCurrency(received)}
                InputProps={{
                    readOnly: true,
                    sx: {
                        fontSize: '1.6rem',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        backgroundColor: 'white',
                        color: '#2c3e50'
                    }
                }}
                sx={{ mb: 2 }}
            />

            {/* Resumen del cambio */}
            <Box
                sx={{
                    p: 2,
                    border: `1px solid ${change >= 0 ? 'green' : 'red'}`,
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor: 'white'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Total a Pagar:</Typography>
                    <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatCurrency(totalToPay)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Recibido:</Typography>
                    <Typography>{formatCurrency(received)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', color: change >= 0 ? 'success.main' : 'error.main' }}
                    >
                        {change >= 0 ? 'CAMBIO:' : 'FALTANTE:'}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', color: change >= 0 ? 'success.main' : 'error.main' }}
                    >
                        {change >= 0 ? formatCurrency(change) : formatCurrency(Math.abs(change))}
                    </Typography>
                </Box>
            </Box>

            {/* Teclado numérico visual */}
            <Grid container spacing={1}>
                {numpadButtons.map((btn) => (
                    <Grid item xs={3} key={btn}>
                        <Button
                            variant="contained"
                            color={['DEL', 'C'].includes(btn) ? 'warning' : 'info'}
                            onClick={() => handleNumpadInput(btn)}
                            sx={{
                                width: '100%',
                                height: 55,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                backgroundColor: ['DEL', 'C'].includes(btn)
                                    ? '#e74c3c'
                                    : (btn === '.' || btn === '00' || btn === '0'
                                        ? '#bdc3c7'
                                        : '#ecf0f1'),
                                color: ['DEL', 'C'].includes(btn) ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: ['DEL', 'C'].includes(btn)
                                        ? '#c0392b'
                                        : (btn === '.' || btn === '00' || btn === '0'
                                            ? '#95a5a6'
                                            : '#d5dbdb')
                                }
                            }}
                        >
                            {btn}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};
