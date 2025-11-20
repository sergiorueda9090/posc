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
import { createThunks, updateThunks } from "../../store/subcategoriaStore/subcategoriaThunks";
import { useForm } from "../Hook/useForm";
import { SelectComponent } from "./SelectComponent";

export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  const { openModalStore } = useSelector((state) => state.globalStore);
  const subcategoriaStore  = useSelector((state) => state.subcategoriaStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(subcategoriaStore);

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };


  const handleSubmit = (event) => {

    event.preventDefault();

    const isEdit = Boolean(formValues.idSubcategoria);

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
      categoria_id        : formValues.categoria_id,
      nombre              : formValues.nombre,
      descripcion         : formValues.descripcion,
      creado_por_username : formValues.creado_por_username,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idSubcategoria, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
          <Dialog
            open={openModalStore}
            keepMounted
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            PaperProps={{
              sx: {
                maxHeight: "90vh",
                overflow: "visible",
              },
            }}
          >
            <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
              {formValues.idCliente ? "Editar Subcategoria" : "Crear Subcategoria"}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  maxHeight: "75vh",
                  overflowY: "auto",
                }}
              >
                <DialogContentText>
                  Completa la información del cliente antes de guardar los cambios.
                </DialogContentText>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={12}>
                    <SelectComponent />
                  </Grid>
                </Grid>

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
                      size="small"
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
                      size="small"
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="outlined" color="primary">
                  {formValues.idCliente ? "Guardar Cambios" : "Crear Subcategoria"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

  );
};
