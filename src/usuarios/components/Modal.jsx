import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModalShared, showAlert } from "../../store/globalStore/globalStore";
import { createThunks, updateThunks } from "../../store/usersStore/usersThunks";

export const FormDialogUser = () => {
  const dispatch = useDispatch();
  const { openModalStore } = useSelector((state) => state.globalStore);
  const usersStore = useSelector((state) => state.usersStore);

  const [formValues, setFormValues] = useState(usersStore);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues(usersStore);
  }, [usersStore]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Validar creación
  const validateForm = () => {
    const newErrors = {};
    if (formValues.idrol === "") newErrors.idrol = "El Rol es obligatorio";
    if (!formValues.username?.trim()) newErrors.username = "El usuario es obligatorio";
    if (!formValues.first_name?.trim()) newErrors.first_name = "El nombre es obligatorio";
    if (!formValues.last_name?.trim()) newErrors.last_name = "El apellido es obligatorio";
    if (!formValues.password?.trim())
      newErrors.password = "La contraseña es obligatoria";
    else if (formValues.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!formValues.repetirPassword?.trim())
      newErrors.repetirPassword = "Debes repetir la contraseña";
    else if (formValues.repetirPassword !== formValues.password)
      newErrors.repetirPassword = "Las contraseñas deben coincidir";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("\n");
      dispatch(
        showAlert({
          type: "error",
          title: "Error al Crear",
          text: errorMessages,
        })
      );
    }
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Validar actualización
  const validateUpdateForm = () => {
    const newErrors = {};
    if (formValues.username && !formValues.username.trim())
      newErrors.username = "El usuario es obligatorio";
    if (formValues.idrol === "") newErrors.idrol = "El Rol es obligatorio";
    if (formValues.first_name && !formValues.first_name.trim())
      newErrors.first_name = "El nombre es obligatorio";
    if (formValues.last_name && !formValues.last_name.trim())
      newErrors.last_name = "El apellido es obligatorio";

    if (formValues.password) {
      if (!formValues.password.trim()) newErrors.password = "La contraseña es obligatoria";
      else if (formValues.password.length < 6)
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formValues.repetirPassword) {
      if (!formValues.repetirPassword.trim())
        newErrors.repetirPassword = "Debes repetir la contraseña";
      else if (formValues.repetirPassword !== formValues.password)
        newErrors.repetirPassword = "Las contraseñas deben coincidir";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("\n");
      dispatch(
        showAlert({
          type: "error",
          title: "Error al Actualizar",
          text: errorMessages,
        })
      );
    }
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValues.idUser == null) {
      if (validateForm()) {
        const data = {
          username: formValues.username,
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          password: formValues.password,
          repetirPassword: formValues.repetirPassword,
          idrol: formValues.idrol,
          is_active: formValues.is_active,
          is_superuser: 1,
        };
        dispatch(createThunks(data));
      }
    } else {
      if (validateUpdateForm()) {
        const data = {
          id: formValues.idUser,
          username: formValues.username,
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          password: formValues.password,
          repetirPassword: formValues.repetirPassword,
          idrol: formValues.idrol,
          is_active: formValues.is_active,
          is_superuser: 1,
        };
        await dispatch(updateThunks(data));
      } else {
        console.log("Errores en el formulario:", errors);
      }
    }
  };

  const handleClose = () => {
    dispatch(closeModalShared());
  };

  return (
    <Dialog
      open={openModalStore}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {formValues.idUser == null ? "Crear Usuario" : "Editar Usuario"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Utiliza este formulario para crear o editar un usuario. Completa los
            campos requeridos y asegúrate de que toda la información sea correcta
            antes de confirmar.
          </DialogContentText>

          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Usuario"
                variant="outlined"
                value={formValues.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="first_name"
                name="first_name"
                label="Nombres"
                variant="outlined"
                value={formValues.first_name}
                onChange={handleChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="last_name"
                name="last_name"
                label="Apellidos"
                variant="outlined"
                value={formValues.last_name}
                onChange={handleChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                value={formValues.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="repetirPassword"
                name="repetirPassword"
                type="password"
                label="Repetir Password"
                variant="outlined"
                value={formValues.repetirPassword}
                onChange={handleChange}
                error={Boolean(errors.repetirPassword)}
                helperText={errors.repetirPassword}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                id="idrol"
                name="idrol"
                select
                label="Rol Usuario"
                SelectProps={{ native: true }}
                value={formValues.idrol}
                onChange={handleChange}
              >
                <option value="">Seleccionar Rol</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                id="is_active"
                name="is_active"
                select
                label="Estado del Usuario"
                SelectProps={{ native: true }}
                value={formValues.is_active}
                onChange={handleChange}
              >
                <option value="0">Inactivo</option>
                <option value="1">Activo</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancelar
          </Button>
          {formValues.idUser == null ? (
            <Button type="submit" variant="outlined" color="primary">
              Crear Usuario
            </Button>
          ) : (
            <Button type="submit" variant="outlined" color="success">
              Editar Usuario
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
