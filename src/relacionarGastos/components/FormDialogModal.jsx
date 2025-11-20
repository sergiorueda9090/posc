import React, {useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
  TextField,
  Autocomplete
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModalShared, showAlert } from "../../store/globalStore/globalStore";
import { getAllThunks } from "../../store/gastoStore/gastoThunks";
import { createThunks, updateThunks } from "../../store/relacionarGastoStore/relacionarGastoThunks";

import { useForm } from "../Hook/useForm";


export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const { openModalStore } = useSelector((state) => state.globalStore);
  const gastoStore         = useSelector((state) => state.gastoStore);
  const relacionarGastoStore = useSelector((state) => state.relacionarGastoStore);

  const hableData = () => {
    const results = gastoStore?.gastos?.results ?? [];

    return results.map((gasto) => ({
      label: gasto?.nombre ?? "Sin nombre",
      id: gasto?.id ?? null,
    }));
  };

  const options        = hableData();
  const selectedOption = options.find((opt) => opt.id == relacionarGastoStore.gasto_id) || null;


  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(relacionarGastoStore);



  const formatNumber = (value) => {
    if (!value) return "";
    
    const numeric = value.replace(/\D/g, "");

    if (!numeric) return "";

    return Number(numeric).toLocaleString("es-CO"); 
    // ejemplo: 1000000 → "1.000.000"
  };

  const unformatNumber = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, ""); // solo números
  };

  const handleMoneyChange = (e) => {
    const raw = unformatNumber(e.target.value);   // sin puntos
    const formatted = formatNumber(raw);          // con puntos

    handleChange({
      target: {
        name: "total_gasto",
        value: formatted,
      },
    });

    console.log("formatted: ", formatted);
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };

  const removeThousandsSeparator = (value) => {
    if (!value) return "";
    return value.replace(/\./g, ""); // quita todos los puntos
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isEdit = Boolean(formValues.idRelacionGasto);
    const isValid = isEdit ? validateUpdate() : validateCreate();

    if (!isValid) {
      const errorMessages = Object.values(errors).join("\n");

      dispatch(
        showAlert({
          type: "error",
          title: "Error",
          text: errorMessages,
        })
      );
      return;
    }

    const data = {
      gasto_id: formValues.gasto_id,
      total_gasto: removeThousandsSeparator(formValues.total_gasto), // 🔥 limpio aquí
      descripcion: formValues.descripcion,
      creado_por_username: formValues.creado_por_username,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idRelacionGasto, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog open={openModalStore} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {formValues.idGasto ? "Editar Gasto" : "Crear Gasto"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del gasto antes de guardar los cambios.
          </DialogContentText>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Autocomplete
                options={options}
                value={selectedOption}
                getOptionLabel={(option) => option?.label || ""}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} label="Gastos" name="gasto_id" />
                )}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "gasto_id",
                      value: newValue?.id ?? ""
                    }
                  });
                }}
              />
              
            </Grid>

            
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="total_gasto"
                name="total_gasto"
                label="Total Gasto"
                variant="outlined"
                value={formValues.total_gasto || ""}
                onChange={handleMoneyChange}
                error={Boolean(errors.total_gasto)}
                helperText={errors.total_gasto}
                size="small"
                inputProps={{ inputMode: "numeric" }} // solo números en móvil
              />  
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="descripcion"
                name="descripcion"
                label="Descripción"
                variant="outlined"
                value={formValues.descripcion}
                onChange={handleChange}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
                size="small"
                multiline
                rows={4}
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {formValues.idGasto ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
