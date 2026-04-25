import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import VerifyOTP from './pages/VerifyOTP'
import ProfileSetup from './pages/ProfileSetup'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Preferences from './pages/Preferences'
import Designs from './pages/Designs'
import Measurements from './pages/Measurements'
import Confirmation from './pages/Confirmation'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
