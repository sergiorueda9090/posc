import { Navigate, Route, Routes } from "react-router-dom"
import { MainPage } from "../pages/MainPage"

export const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/subcategorias" element={ <MainPage /> } />
        <Route path="/*"          element={ <Navigate to="/" /> } />
    </Routes>
  )
}
