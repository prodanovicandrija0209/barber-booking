import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ServicesList from './pages/ServicesList'
import ServiceDetail from './pages/ServiceDetail'
import ServiceBooking from './pages/ServiceBooking'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './router/ProtectedRoute'
import AdminRoute from './router/AdminRoute'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/services/:id/book" element={<ServiceBooking />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-reservations" element={<MyReservations />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
