import React, {useEffect} from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useDispatch } from "react-redux";
import { getAllThunks } from "../../store/usersStore/usersThunks";

export const NothingSelectedView = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/users"); // Redirige al dashboard o a la página de inicio
  };
  
  const dispatch = useDispatch();

  useEffect(() => {
      //dispatch(getAllThunks());
    },[])

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "#f4f5f7" }}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Ícono en lugar de la imagen */}
        <ErrorOutlineIcon sx={{ fontSize: 120, color: "#0088fe", mb: 2 }} />

        <Typography
          variant="h5"
          sx={{ mt: 2, mb: 3, color: "text.secondary" }}
        >
          ¡Ups! La página que buscas no existe.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2, px: 5, py: 1.5, backgroundColor: "#673ab7" }}
          onClick={handleGoBack}
        >
          Volver al inicio
        </Button>
      </Box>
    </Grid>
  );
}
