import { Navigate, Route, Routes } from "react-router-dom"
import { MainPage }           from "../pages/MainPage"
import  {MainPageReporte}     from "../pages/MainPageReporte";
import {MainViewDevoluciones} from "../views/MainViewDevoluciones.jsx";

export const MainRoutes = () => {
  return (
    <Routes>
      {/* Página principal del POS */}
      <Route path="/" element={<MainPage />} />

      {/* Reporte de ventas */}
      <Route path="/reporte"      element={<MainPageReporte />} />

      <Route path="/devoluciones" element={<MainViewDevoluciones />} />

      {/* Redirección por defecto */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};