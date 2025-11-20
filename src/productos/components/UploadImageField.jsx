import React, { useState } from "react";
import { Grid, TextField, Button, Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const UploadImageField = ({ formValues, setFormValues }) => {
  const [preview, setPreview] = useState(formValues.imagen_url || null);

  // 🔹 Manejar cambio de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mostrar preview
      const imagePreview = URL.createObjectURL(file);
      setPreview(imagePreview);

      // Guardar el archivo en el formValues
      setFormValues((prev) => ({
        ...prev,
        imagen: file,
      }));
    }
  };

  // 🔹 Eliminar imagen
  const handleRemoveImage = () => {
    setPreview(null);
    setFormValues((prev) => ({
      ...prev,
      imagen: null,
    }));
  };

  return (
    <Grid item xs={12} sm={4}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Imagen del producto
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          border: "1px dashed #ccc",
          borderRadius: "8px",
          padding: 2,
          textAlign: "center",
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: 8,
              }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleRemoveImage}
            >
              Eliminar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              Subir imagen
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontSize: "0.8rem" }}
            >
              PNG, JPG o JPEG
            </Typography>
          </>
        )}
      </Box>
    </Grid>
  );
};
