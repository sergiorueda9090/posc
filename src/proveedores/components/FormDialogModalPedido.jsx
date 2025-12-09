import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch, useSelector } from "react-redux";
import { hideModalPedido, showAlert } from "../../store/globalStore/globalStore";
import { getAllThunks as getAllProductos } from "../../store/productoStore/productoThunks";
import { 
  handleFormStoreThunk, 
  resetFormularioThunk,
  createOrdenThunk,
  getSiguienteNumeroOrdenThunk // 🔥 NUEVO
} from "../../store/proveedoresOrdenesStore/proveedoresOrdenesThunks";

const ESTADO_OPCIONES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en_transito', label: 'En Tránsito' },
  { value: 'recibida', label: 'Recibida' },
  { value: 'cancelada', label: 'Cancelada' },
];

export const FormDialogModalPedido = () => {

  const dispatch = useDispatch();
  
  const { openModalPedido } = useSelector((state) => state.globalStore);
  const { proveedores }     = useSelector((state) => state.proveedoresStore);
  const { productos }       = useSelector((state) => state.productoStore);
  
  const {
    idOrden, 
    proveedor_id, 
    producto_id,
    producto_nombre,
    precio_compra,
    numero_orden, 
    estado, 
    notas, 
    cantidad, 
    detalles
  } = useSelector((state) => state.proveedoresOrdenesStore);

  const proveedoresResults = proveedores?.results && Array.isArray(proveedores.results) && proveedores.results.length > 0
    ? proveedores.results.map(prov => ({
        id: prov.id,
        value: prov.id,
        label: `${prov.nombre_empresa} - ${prov.ciudad}`,
      }))
    : [];

  const productosResults = productos?.results && Array.isArray(productos.results) && productos.results.length > 0
    ? productos.results.map(prod => ({
        id: prod.id,
        nombre: prod.nombre,
        label: prod.nombre,
        precio_compra: prod.precio_compra,
        categoria: prod.categoria_nombre,
      }))
    : [];

  const proveedorSeleccionado = proveedoresResults.find(p => p.value === proveedor_id) || null;
  const productoSeleccionado = productosResults.find(p => p.id === producto_id) || null;

  // 🔥 Obtener siguiente número de orden al abrir el modal
  useEffect(() => {
    if (openModalPedido && !idOrden) {
      dispatch(resetFormularioThunk());
      dispatch(getSiguienteNumeroOrdenThunk()); // 🔥 Obtener número consecutivo
    }
  }, [openModalPedido, idOrden, dispatch]);

  const handleClose = () => {
    dispatch(hideModalPedido());
    dispatch(resetFormularioThunk());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    dispatch(handleFormStoreThunk({
      name: name,
      value: name === "cantidad" ? parseInt(value) || 1 : value,
    }));
  };

  const handleProveedorChange = (event, newValue) => {
    const proveedorId = newValue ? newValue.value : null;
    
    dispatch(handleFormStoreThunk({
      name: "proveedor_id",
      value: proveedorId,
    }));

    dispatch(handleFormStoreThunk({
      name: "producto_id",
      value: null,
    }));
    
    dispatch(handleFormStoreThunk({
      name: "detalles",
      value: [],
    }));

    if (proveedorId) {
      dispatch(getAllProductos({ 
        page: 1, 
        pageSize: 100, 
        search: "", 
        start_date: "", 
        end_date: "", 
        proveedor_id: proveedorId 
      }));
    }
  };

  const handleProductoChange = (event, newValue) => {
    dispatch(handleFormStoreThunk({
      name: "producto_id",
      value: newValue ? newValue.id : null,
    }));
    
    dispatch(handleFormStoreThunk({
      name: "producto_nombre",
      value: newValue ? newValue.nombre : "",
    }));
    
    dispatch(handleFormStoreThunk({
      name: "precio_compra",
      value: newValue ? newValue.precio_compra : 0,
    }));
  };

  const handleAgregarProducto = () => {
    if (!producto_id) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Debe seleccionar un producto",
      }));
      return;
    }

    if (!cantidad || cantidad <= 0) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "La cantidad debe ser mayor a 0",
      }));
      return;
    }

    const existe = detalles.find(d => d.producto_id === producto_id);
    
    if (existe) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Este producto ya está en la lista",
      }));
      return;
    }

    const nuevoDetalle = {
      producto_id: producto_id,
      nombre: producto_nombre,
      precio_compra: precio_compra,
      cantidad: cantidad,
      subtotal: precio_compra * cantidad,
    };

    dispatch(handleFormStoreThunk({
      name: 'detalles',
      value: [...detalles, nuevoDetalle],
    }));

    dispatch(handleFormStoreThunk({
      name: "producto_id",
      value: null,
    }));
    
    dispatch(handleFormStoreThunk({
      name: "producto_nombre",
      value: "",
    }));
    
    dispatch(handleFormStoreThunk({
      name: "precio_compra",
      value: 0,
    }));
    
    dispatch(handleFormStoreThunk({
      name: "cantidad",
      value: 1,
    }));
  };

  const handleEliminarProducto = (productoId) => {
    const nuevosDetalles = detalles.filter(d => d.producto_id !== productoId);
    
    dispatch(handleFormStoreThunk({
      name: 'detalles',
      value: nuevosDetalles,
    }));
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      return total + detalle.subtotal;
    }, 0);
  };

  const handleGenerarPDF = () => {
    if (!proveedor_id) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Debe seleccionar un proveedor",
      }));
      return;
    }

    if (detalles.length === 0) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Debe agregar al menos un producto",
      }));
      return;
    }

    dispatch(showAlert({
      type: "success",
      title: "PDF Generado",
      text: "La orden de pedido se ha generado correctamente",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!proveedor_id) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Debe seleccionar un proveedor",
      }));
      return;
    }

    if (!numero_orden || numero_orden.trim() === "") {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Error al generar el número de orden. Intente nuevamente.",
      }));
      return;
    }

    if (detalles.length === 0) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Debe agregar al menos un producto",
      }));
      return;
    }

    const data = {
      proveedor_id: proveedor_id,
      numero_orden: numero_orden,
      estado: estado || 'pendiente',
      notas: notas || '',
      detalles: detalles.map(d => ({
        producto_id   : d.producto_id,
        nombre        : d.nombre,
        precio_compra : d.precio_compra,
        cantidad      : d.cantidad,
      })),
    };

    console.log("Datos a enviar:", data);

    dispatch(createOrdenThunk(data));
  };

  return (
    <Dialog 
      open={openModalPedido} 
      keepMounted 
      onClose={handleClose} 
      fullWidth 
      maxWidth="lg"
    >
      <DialogTitle sx={{ padding: "16px 4px 0px 16px" }}>
        {idOrden ? "Editar Orden de Pedido" : "Crear Orden de Pedido"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            
            {/* 🔥 FILA 1: Proveedor y Número de Orden (DESHABILITADO) */}
            <Grid item xs={8}>
              <Autocomplete
                size="small"
                options={proveedoresResults}
                value={proveedorSeleccionado}
                onChange={handleProveedorChange}
                getOptionLabel={(option) => option?.label || ""}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                renderInput={(params) => (
                  <TextField {...params} label="Seleccione un proveedor *" />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                name="numero_orden"
                label="Número de Orden"
                variant="outlined"
                size="small"
                value={numero_orden || "Cargando..."}
                disabled // 🔥 NO EDITABLE
                InputProps={{
                  readOnly: true, // 🔥 SOLO LECTURA
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000', // Texto negro cuando está deshabilitado
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>

            {/* Estado */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="estado"
                label="Estado de la Orden *"
                variant="outlined"
                size="small"
                value={estado || 'pendiente'}
                onChange={handleChange}
              >
                {ESTADO_OPCIONES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Sección de agregar productos */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Agregar Productos
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                size="small"
                name="producto"
                options={productosResults}
                value={productoSeleccionado}
                onChange={handleProductoChange}
                getOptionLabel={(option) => option?.label || ""}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                disabled={!proveedor_id}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.nombre}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Precio compra: {" "}
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(option.precio_compra)}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Seleccione un producto *" 
                    helperText={!proveedor_id ? "Primero seleccione un proveedor" : ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                name="cantidad"
                type="number"
                label="Cantidad"
                variant="outlined"
                size="small"
                value={cantidad || 1}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAgregarProducto}
                startIcon={<AddIcon />}
                sx={{ height: '40px' }}
                disabled={!proveedor_id}
              >
                Agregar
              </Button>
            </Grid>

            {/* Tabla de productos */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Productos en la Orden
              </Typography>
              
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F7C548" }}>
                      <TableCell><strong>Producto</strong></TableCell>
                      <TableCell><strong>Precio Compra</strong></TableCell>
                      <TableCell><strong>Cantidad</strong></TableCell>
                      <TableCell><strong>Subtotal</strong></TableCell>
                      <TableCell width={80}><strong>Acción</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      detalles.map((detalle, index) => (
                        <TableRow 
                          key={detalle.producto_id} 
                          sx={{
                            backgroundColor: index % 2 === 0 ? "#FFF7E6" : "#FFFDF7"
                          }}
                        >
                          <TableCell>{detalle.nombre}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(detalle.precio_compra)}
                          </TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(detalle.subtotal)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleEliminarProducto(detalle.producto_id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {detalles.length > 0 && (
                      <TableRow sx={{ backgroundColor: "#F7C548" }}>
                        <TableCell colSpan={3} align="right">
                          <strong>TOTAL:</strong>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(calcularTotal())}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="notas"
                label="Notas / Observaciones (Opcional)"
                variant="outlined"
                size="small"
                value={notas || ""}
                onChange={handleChange}
                placeholder="Ingrese cualquier observación adicional sobre esta orden..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            color="error"
          >
            Cancelar
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGenerarPDF}
            disabled={detalles.length === 0}
          >
            Generar PDF
          </Button>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={detalles.length === 0 || !proveedor_id || !numero_orden}
          >
            {idOrden ? "Actualizar Orden" : "Crear Orden"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};