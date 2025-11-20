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
import { createThunks, updateThunks } from "../../store/clienteStore/clienteThunks";
import { useForm } from "../Hook/useForm";

export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  const { openModalStore } = useSelector((state) => state.globalStore);
  const clienteStore       = useSelector((state) => state.clientesStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(clienteStore);

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };

  console.log(" = == formValues.idCliente == ",formValues.idCliente)
  const handleSubmit = (event) => {

    event.preventDefault();

    const isEdit = Boolean(formValues.idCliente);

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
      nombre    : formValues.nombre,
      apellido  : formValues.apellido,
      email     : formValues.email,
      telefono  : formValues.telefono,
      direccion : formValues.direccion,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idCliente, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog open={openModalStore} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {formValues.idCliente ? "Editar Cliente" : "Crear Cliente"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del cliente antes de guardar los cambios.
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
                id="apellido"
                name="apellido"
                label="Apellido"
                variant="outlined"
                value={formValues.apellido}
                onChange={handleChange}
                error={Boolean(errors.apellido)}
                helperText={errors.apellido}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Correo Electrónico"
                variant="outlined"
                value={formValues.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                variant="outlined"
                value={formValues.telefono}
                onChange={handleChange}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="direccion"
                name="direccion"
                label="Dirección"
                variant="outlined"
                value={formValues.direccion}
                onChange={handleChange}
                error={Boolean(errors.direccion)}
                helperText={errors.direccion}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {formValues.idCliente ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
