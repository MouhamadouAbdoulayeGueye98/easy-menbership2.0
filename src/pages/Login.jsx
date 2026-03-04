import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
     navigate("/");
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://cloudfront-eu-central-1.images.arcpublishing.com/le360/6FSMQ34R5VDU5PYAHQHLOB3MJA.jpeg')",
        }}
      ></div>

      {/* Carte de connexion */}
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-emerald-500 mb-8 text-center">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="transform transition duration-300 hover:scale-105">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
            />
          </div>

          <div className="transform transition duration-300 hover:scale-105">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transform hover:scale-105 transition duration-200"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Pas encore de compte?{" "}
          <a href="/inscription" className="text-emerald-500 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>

      {/* Animations Tailwind */}
      <style>{`
        @keyframes fadeIn {
          0% {opacity:0; transform: translateY(20px);}
          100% {opacity:1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
