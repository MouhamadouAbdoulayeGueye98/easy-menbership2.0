import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Erreur lors de l'inscription");
        return;
      }

      alert("Inscription réussie !");
      window.location.href = "/login"; // redirection vers login

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Impossible de contacter le serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://www.institutafriquemonde.org/wp-content/uploads/2019/09/Tontine-%C3%A0-Bamako-9-12-2006.jpg')",
        }}
      ></div>

      {/* Carte d'inscription */}
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-emerald-500 mb-8 text-center">
          S'inscrire
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="transform transition duration-300 hover:scale-105">
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
            />
          </div>

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

          <div className="transform transition duration-300 hover:scale-105">
            <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transform hover:scale-105 transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Déjà un compte ?{" "}
          <a href="/login" className="text-emerald-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>

      {/* Animation fadeIn */}
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