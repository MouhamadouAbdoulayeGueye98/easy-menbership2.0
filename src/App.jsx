import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Members from "./pages/Members"
import Payments from "./pages/Payments"
import Events from "./pages/Events"
import Login from "./pages/Login"
import Inscription from "./pages/Inscription"
import Layout from "./components/Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page login sans Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription/>} />

        {/* Pages protégées avec Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="payments" element={<Payments />} />
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
