import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-emerald-500 shadow-md flex justify-around py-3 text-sm text-white">
      <Link to="/" className="hover:text-yellow-300 transition-colors duration-200">
        Accueil
      </Link>
      <Link to="/members" className="hover:text-yellow-300 transition-colors duration-200">
        Membres
      </Link>
      <Link to="/payments" className="hover:text-yellow-300 transition-colors duration-200">
        Paiements
      </Link>
      <Link to="/events" className="hover:text-yellow-300 transition-colors duration-200">
        Événements
      </Link>
    </div>
  );
}
