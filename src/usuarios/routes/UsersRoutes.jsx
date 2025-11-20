import { Navigate, Route, Routes } from "react-router-dom"
import { UsersPage } from "../pages/UsersPage"

export const UsersRoutes = () => {
  return (
    <Routes>
        <Route path="/users" element={ <UsersPage /> } />
        <Route path="/*"     element={ <Navigate to="/" /> } />
    </Routes>
  )
}
