import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModalShared, showAlert } from "../../store/globalStore/globalStore";
import { createThunks, updateThunks } from "../../store/tarjetasBancariasStore/tarjetasBancariasStoreThunks";
import { useForm } from "../Hook/useForm";

export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  const { openModalStore } = useSelector((state) => state.globalStore);
  const tarjetasBancariasStore         = useSelector((state) => state.tarjetasBancariasStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(tarjetasBancariasStore);

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };


  const handleSubmit = (event) => {

    event.preventDefault();

    const isEdit = Boolean(formValues.idTarjeta);

    const isValid = isEdit ? validateUpdate() : validateCreate();

    if (!isValid) {
      const errorMessages = Object.values(errors).join("\n");
           
      dispatch(showAlert({
              type: "error",
              title: "Error",
              text: errorMessages,
            }))

      return;
    }

    const data = {
      nombre              : formValues.nombre,
      pan                 : formValues.pan,
      descripcion         : formValues.descripcion,
      creado_por_username : formValues.creado_por_username,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idTarjeta, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog open={openModalStore} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {formValues.idTarjeta ? "Editar Tarjeta" : "Crear Tarjeta"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del gasto antes de guardar los cambios.
          </DialogContentText>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                variant="outlined"
                value={formValues.nombre}
                onChange={handleChange}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="pan"
                name="pan"
                label="Número de cuenta"
                variant="outlined"
                value={formValues.pan}
                onChange={handleChange}
                error={Boolean(errors.pan)}
                helperText={errors.pan}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </Grid>

            <Grid item xs={6}>
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
