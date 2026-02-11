import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ServicesList from './pages/ServicesList'
import ServiceDetail from './pages/ServiceDetail'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
