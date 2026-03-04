import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="min-h-screen bg-sky-100">
      <div className="p-4">
        <Outlet /> {/* Les routes enfants s’affichent ici */}
      </div>
      <Navbar />
    </div>
  )
}
