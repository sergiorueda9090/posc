import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box } from '@mui/material';
import dayjs from "dayjs";

import { getAllThunks } from '../../store/productoStore/productoThunks';
import { startDateGlobalStore, endDateGlobalStore } from '../../store/globalStore/globalStore';

export const DateRange = () => {

  const dispatch = useDispatch();
  const { startDate, endDate, searchQuery } = useSelector(state => state.globalStore);
  
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Debes seleccionar ambas fechas para filtrar.");
      return;
    }

    const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
    const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

    dispatch(getAllThunks({
      page        : 1,
      start_date  : formattedStartDate,
      end_date    : formattedEndDate,
      search      : searchQuery
    }));
    
  };


  const handleClearDates = () => {
    dispatch(startDateGlobalStore(''));
    dispatch(endDateGlobalStore(''));
    dispatch(getAllThunks());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={1} marginBottom={2} alignItems="center">
        
        {/* Fecha Inicio */}
        <DatePicker
          label="Fecha inicio"
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) =>
            dispatch(startDateGlobalStore(newValue ? newValue.format("YYYY-MM-DD") : ''))
          }
          slotProps={{ textField: { size: "small" } }}
          size="small"
        />

        {/* Fecha Fin */}
        <DatePicker
          label="Fecha fin"
          value={endDate ? dayjs(endDate) : null}
          onChange={(newValue) =>
            dispatch(endDateGlobalStore(newValue ? newValue.format("YYYY-MM-DD") : ''))
          }
          slotProps={{ textField: { size: "small" } }}
          size="small"
        />

        {/* Botón Buscar */}
        <Button
          variant="contained"
          onClick={handleFilter}
          disabled={!startDate || !endDate}
          size="small"
          sx={{ minWidth: "auto", px: 2 }}
        >
          Buscar
        </Button>

        {/* Botón Limpiar */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearDates}
          size="small"
          sx={{ minWidth: "auto", px: 2 }}
        >
          Limpiar
        </Button>
      </Box>
    </LocalizationProvider>
  );
};
