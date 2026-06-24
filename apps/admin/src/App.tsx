import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@glamping/ui'
import AdminLayout from './layouts/AdminLayout'
import Tickets from './pages/Tickets/Tickets'
import Chats from './pages/Chats/Chats'
import Menu from './pages/Menu/Menu'
import Services from './pages/Services/Services'
import CheckIn from './pages/CheckIn/CheckIn'
import InfoEditor from './pages/InfoEditor/InfoEditor'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Tickets />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/services" element={<Services />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/info-editor" element={<InfoEditor />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
