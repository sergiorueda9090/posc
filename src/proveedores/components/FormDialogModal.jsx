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
import { createThunks, updateThunks } from "../../store/proveedoresStore/proveedoresThunks";
import { useForm } from "../Hook/useForm";

export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  const { openModalStore } = useSelector((state) => state.globalStore);
  const proveedoresStore         = useSelector((state) => state.proveedoresStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(proveedoresStore);

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };


  const handleSubmit = (event) => {

    event.preventDefault();

    const isEdit = Boolean(formValues.idProveedor);

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
      nombre_empresa      : formValues.nombre_empresa,
      descripcion         : formValues.descripcion,
      ciudad              : formValues.ciudad, 
      creado_por_username : formValues.creado_por_username,
      
      /*email               : formValues.email,
      contacto_principal  : formValues.contacto_principal,
      telefono            : formValues.telefono,
      direccion           : formValues.direccion,*/
      
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idProveedor, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog open={openModalStore} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {formValues.idProveedor ? "Editar Proveedor" : "Crear Proveedor"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del proveedor antes de guardar los cambios.
          </DialogContentText>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <TextField
               size="small"
                fullWidth
                id="nombre_empresa"
                name="nombre_empresa"
                label="Nombre Proveedor"
                variant="outlined"
                value={formValues.nombre_empresa}
                onChange={handleChange}
                error={Boolean(errors.nombre_empresa)}
                helperText={errors.nombre_empresa}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                id="ciudad"
                name="ciudad"
                label="ciudad"
                variant="outlined"
                value={formValues.ciudad}
                onChange={handleChange}
                error={Boolean(errors.ciudad)}
                helperText={errors.ciudad}
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
                multiline
                rows={3}
                size="small"
              />
            </Grid>

            {/*
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={formValues.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>

            
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="contacto_principal"
                name="contacto_principal"
                label="contacto_principal"
                variant="outlined"
                value={formValues.contacto_principal}
                onChange={handleChange}
                error={Boolean(errors.contacto_principal)}
                helperText={errors.contacto_principal}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="telefono"
                variant="outlined"
                value={formValues.telefono}
                onChange={handleChange}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                id="direccion"
                name="direccion"
                label="direccion"
                variant="outlined"
                value={formValues.direccion}
                onChange={handleChange}
                error={Boolean(errors.direccion)}
                helperText={errors.direccion}
              />
            </Grid>*/}



          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary">
            {formValues.idProveedor ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
