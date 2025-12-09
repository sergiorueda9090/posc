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
import { getAllThunks as getAllClientes } from "../../store/clienteStore/clienteThunks";

import { createThunks, updateThunks } from "../../store/ajusteDeSaldoStore/ajusteDeSaldoThunks";

import { useForm } from "../Hook/useForm";


export const FormDialogModal = () => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllClientes());
  }, [dispatch]);

  const { openModalStore } = useSelector((state) => state.globalStore);
  const {clientes}       = useSelector((state) => state.clientesStore);
  const ajusteDeSaldoStore = useSelector((state) => state.ajusteDeSaldoStore);


  const hableData = () => {
    const results = clientes?.results ?? [];
    return results.map((cliente) => ({
      label: cliente?.nombre ?? "Sin nombre",
      id   : cliente?.id ?? null,
    }));
  };


  const options        = hableData();
  const selectedOption = options.find((opt) => opt.id == ajusteDeSaldoStore.cliente_id) || null;
  
  const {
    formValues,
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  } = useForm(ajusteDeSaldoStore);

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
        name: "valor",
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

    const isEdit = Boolean(formValues.idAjusteDeSaldo);

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
      cliente_id  : formValues.cliente_id,
      valor       : removeThousandsSeparator(formValues.valor),
      descripcion : formValues.descripcion,
      creado_por_username: formValues.creado_por_username,
    };

    if (isEdit) {
      dispatch(updateThunks({ id: formValues.idAjusteDeSaldo, ...data }));
    } else {
      dispatch(createThunks(data));
    }

    handleClose();
  };

  return (
    <Dialog open={openModalStore} keepMounted onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
         {formValues.idAjusteDeSaldo ? "Editar Ajuste de saldo" : "Crear Ajuste de saldo"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Completa la información del Recepción de pago antes de guardar los cambios.
          </DialogContentText>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Autocomplete
                options={options}
                value={selectedOption}
                getOptionLabel={(option) => option?.label || ""}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} label="Clientes" name="cliente_id" />
                )}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "cliente_id",
                      value: newValue?.id ?? ""
                    }
                  });
                }}
              />
            </Grid>
         
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="valor"
                name="valor"
                label="Valor"
                variant="outlined"
                value={formValues.valor || ""}
                onChange={handleMoneyChange}
                error={Boolean(errors.valor)}
                helperText={errors.valor}
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
            { formValues.idAjusteDeSaldo ? "Actualizar" : "Crear" }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
