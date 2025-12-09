import React, {useState} from "react";
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
import { useForm } from "../Hook/useForm";
import { SelectComponent } from "./SelectComponent";
import { SubSelectComponent } from "./SubSelectComponent";
import { SelectComponentUnidadMedida } from "./SelectComponentUnidadMedida";
import { SelectComponentGenero } from "./SelectComponentGenero";
import { SelectComponentProveedor } from "./SelectComponentProveedor";

export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  const { openModalStore } = useSelector((state) => state.globalStore);
  const productoStore  = useSelector((state) => state.productoStore);

  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(productoStore);

  const handleClose = () => {
    resetForm();
    setErrors({});
    dispatch(closeModalShared());
  };
  
  const [selectedImage, setSelectedImage] = useState(null);

  //Función para manejar la carga de la imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      dispatch(
        showAlert({
          type: "error",
          title: "❌ Archivo no válido",
          text: "Por favor selecciona una imagen (JPG, PNG, etc.)",
        })
      );
      return;
    }

    setSelectedImage(file);
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    const isEdit = Boolean(formValues.id);

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
      subcategoria_id     : formValues.subcategoria_id,
      proveedor_id        : productoStore.proveedor_id,
      nombre              : formValues.nombre,
      descripcion         : formValues.descripcion,
      precio_compra       : formValues.precio_compra,
      precio_venta        : formValues.precio_venta,
      porcentaje_ganancia : formValues.porcentaje_ganancia,
      total               : formValues.total,
      codigo_busqueda     : formValues.codigo_busqueda,
      unidad_medida       : formValues.unidad_medida,
      imagen              : selectedImage,
      creado_por_username : formValues.creado_por_username,
      genero              : formValues.genero,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.id, ...data }));
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
              {formValues.idCliente ? "Editar Producto" : "Crear Producto"}
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

                  <Grid item xs={4}>
                    <SelectComponentProveedor />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <SelectComponent />
                  </Grid>

                  <Grid item xs={4}>
                    <SubSelectComponent />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
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

                  <Grid item xs={4}>
                    <SelectComponentUnidadMedida />
                  </Grid>

                  <Grid item xs={4}>
                    <SelectComponentGenero />
                  </Grid>

                  <Grid item xs={3}>
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

                  <Grid item xs={3}>
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

                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      id="porcentaje_ganancia"
                      name="porcentaje_ganancia"
                      label="Porcentaje de ganancia %"
                      variant="outlined"
                      value={formValues.porcentaje_ganancia}
                      onChange={handleChange}
                      error={Boolean(errors.porcentaje_ganancia)}
                      helperText={errors.porcentaje_ganancia}
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={4}>
                     <TextField
                      fullWidth
                      id="total"
                      name="total"
                      label="Total"
                      variant="outlined"
                      value={formValues.total}
                      onChange={handleChange}
                      error={Boolean(errors.total)}
                      helperText={errors.total}
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
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
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      id="codigo_busqueda"
                      name="codigo_busqueda"
                      label="Código de búsqueda"
                      variant="outlined"
                      value={formValues.codigo_busqueda}
                      onChange={handleChange}
                      error={Boolean(errors.codigo_busqueda)}
                      helperText={errors.codigo_busqueda}
                      size="small"
                    />
                  </Grid>

                    {/* IMAGEN */}
                    <Grid item xs={4}>
                      <Button variant="contained" component="label" fullWidth>
                        Subir Imagen
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange} // ✅ sin useForm
                        />
                      </Button>

                      {selectedImage && (
                        <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                          Archivo seleccionado:{" "}
                          <strong>{selectedImage.name}</strong>
                        </p>
                      )}
                    </Grid>
                
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="outlined" color="primary">
                  {formValues.idCliente ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

  );
};
