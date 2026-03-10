import React, { useState, useEffect } from "react";
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
import { createThunks, updateThunks } from "../../store/productoStore/productoThunks";
import { resetFormularioStore } from "../../store/productoStore/productoStore";
import { useForm } from "../Hook/useForm";
import { SelectComponent } from "./SelectComponent";
import { SubSelectComponent } from "./SubSelectComponent";
import { SelectComponentUnidadMedida } from "./SelectComponentUnidadMedida";
import { SelectComponentGenero } from "./SelectComponentGenero";
import { SelectComponentProveedor } from "./SelectComponentProveedor";

export const FormDialogModal = () => {

  const dispatch = useDispatch();

  const { openModalStore } = useSelector((state) => state.globalStore);
  const productoStore = useSelector((state) => state.productoStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(productoStore);

  const [selectedImage, setSelectedImage] = useState(null);

  const isEdit = Boolean(formValues.id);

  // Limpiar todo cuando el modal se cierra
  useEffect(() => {
    if (!openModalStore) {
      setSelectedImage(null);
      setErrors({});
    }
  }, [openModalStore, setErrors]);

  const handleClose = () => {
    resetForm();
    setErrors({});
    setSelectedImage(null);
    dispatch(resetFormularioStore());
    dispatch(closeModalShared());
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      dispatch(
        showAlert({
          type: "error",
          title: "Archivo no valido",
          text: "Por favor selecciona una imagen (JPG, PNG, etc.)",
        })
      );
      return;
    }

    setSelectedImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = isEdit ? validateUpdate() : validateCreate();

    if (!result.isValid) {
      const errorMessages = Object.values(result.validationErrors).join("\n");
      dispatch(showAlert({
        type: "error",
        title: "Error de validacion",
        text: errorMessages,
      }));
      return;
    }

    const data = {
      categoria_id: formValues.categoria_id,
      subcategoria_id: formValues.subcategoria_id,
      proveedor_id: productoStore.proveedor_id,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      precio_compra: formValues.precio_compra,
      precio_venta: formValues.precio_venta,
      porcentaje_ganancia: formValues.porcentaje_ganancia,
      total: formValues.total,
      codigo_busqueda: formValues.codigo_busqueda,
      unidad_medida: formValues.unidad_medida,
      imagen: selectedImage,
      creado_por_username: formValues.creado_por_username,
      genero: formValues.genero,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.id, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    // Limpiar y cerrar
    handleClose();
  };

  return (
    <Dialog
      open={openModalStore}
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
      <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
        {isEdit ? "Editar Producto" : "Crear Producto"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          <DialogContentText sx={{ mb: 2 }}>
            {isEdit
              ? "Modifica los campos necesarios y guarda los cambios."
              : "Completa la informacion del producto antes de guardarlo."}
          </DialogContentText>

          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={4}>
              <SelectComponentProveedor />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <SelectComponent />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <SubSelectComponent />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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

            <Grid item xs={12} sm={6} md={4}>
              <SelectComponentUnidadMedida />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <SelectComponentGenero />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="precio_compra"
                name="precio_compra"
                label="Precio de compra"
                variant="outlined"
                value={formValues.precio_compra}
                onChange={handleChange}
                error={Boolean(errors.precio_compra)}
                helperText={errors.precio_compra}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="precio_venta"
                name="precio_venta"
                label="Precio de venta"
                variant="outlined"
                value={formValues.precio_venta}
                onChange={handleChange}
                error={Boolean(errors.precio_venta)}
                helperText={errors.precio_venta}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="porcentaje_ganancia"
                name="porcentaje_ganancia"
                label="% Ganancia"
                variant="outlined"
                value={formValues.porcentaje_ganancia}
                onChange={handleChange}
                size="small"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="total"
                name="total"
                label="Total"
                variant="outlined"
                value={formValues.total}
                onChange={handleChange}
                size="small"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="descripcion"
                name="descripcion"
                label="Descripcion"
                variant="outlined"
                value={formValues.descripcion}
                onChange={handleChange}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                id="codigo_busqueda"
                name="codigo_busqueda"
                label="Codigo de busqueda"
                variant="outlined"
                value={formValues.codigo_busqueda}
                onChange={handleChange}
                error={Boolean(errors.codigo_busqueda)}
                helperText={errors.codigo_busqueda}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: 40 }}>
                {selectedImage ? "Cambiar imagen" : "Subir imagen"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {selectedImage && (
                <p style={{ marginTop: 4, fontSize: "0.8rem", color: "#666" }}>
                  {selectedImage.name}
                </p>
              )}
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
