// ================================
// 📦 FormDialogModal.jsx
// ================================
import React, { use, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  TextField,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModalShared, showAlert, hideModalCantidad } from "../../store/globalStore/globalStore";
import { createThunks, updateThunks } from "../../store/inventarioProductoStore/inventarioProductoStoreThunks";
import { useForm } from "../Hook/useForm";
import { DataTable } from "../components/DataTable";


export const FormDialogModal = () => {

  const dispatch = useDispatch();

  const { openModalCantidad }   = useSelector((state) => state.globalStore);
  const inventarioProductoStore = useSelector((state) => state.inventarioProductoStore);
  const { id: idProducto }      = useSelector((state) => state.productoStore);

  console.log("inventarioProductoStore en FormDialogModal:", inventarioProductoStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(inventarioProductoStore);

  console.log("==== formValues == >", formValues);
  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isEdit = Boolean(formValues.idInventario);
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

    const data = { cantidad_unidades: formValues.cantidad, producto_id: idProducto };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idInventario, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog
      open={openModalCantidad}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: "90vw",
          maxHeight: "90vh",
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* 🔹 Header */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.3rem",
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        {formValues.idCliente ? "Editar Cantidad" : "Crear Cantidad"}
      </DialogTitle>

      {/* 🔹 Formulario */}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: "#555" }}>
            Completa la información antes de guardar los cambios.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="cantidad"
                name="cantidad"
                label="Cantidad"
                variant="outlined"
                value={formValues.cantidad || ""}
                onChange={handleChange}
                error={Boolean(errors.cantidad)}
                helperText={errors.cantidad}
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 🔹 Tabla */}
          <Box sx={{ height: 420 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, fontWeight: "bold", color: "#1f1f3d" }}
            >
              Listado de Cantidades
            </Typography>
            <DataTable />
          </Box>
        </DialogContent>

        {/* 🔹 Botones */}
        <DialogActions sx={{ p: 2, borderTop: "1px solid #ddd" }}>
          <Button
            onClick={() => dispatch(hideModalCantidad())}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {formValues.idInventario ? "Guardar Cambios" : "Crear Cantidad"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
