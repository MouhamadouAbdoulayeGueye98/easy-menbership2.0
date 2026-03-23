import { useState, useEffect } from "react";

export default function Dashboard() {
  const [membersCount, setMembersCount] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [events, setEvents] = useState([]);

  const API = "http://localhost:5000"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Nombre de membres
        const resMembers = await fetch(`${API}/members`);
        const dataMembers = await resMembers.json();
        setMembersCount(dataMembers.length);

        //  Cotisations totales
        const resPayments = await fetch(`${API}/payments`);
        const dataPayments = await resPayments.json();
        const total = dataPayments.reduce((sum, p) => sum + p.amount, 0);
        setPaymentsTotal(total);

        //  Événements
        const resEvents = await fetch(`${API}/events`);
        const dataEvents = await resEvents.json();
        setEvents(dataEvents);

      } catch (err) {
        console.error("Erreur Dashboard:", err);
      }
    };

    fetchData();
  }, []);

  // Trier les événements par date
  const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Taux de remplissage
  const fillRate = (event) => {
    if (!event.capacity) return 0;
    return Math.min(100, Math.round((event.participants.length / event.capacity) * 100));
  };

  return (
    <div className="">
      <div className="bg-emerald-500 rounded-xl p-6 text-center mb-4">
        <h1 className="text-4xl font-bold text-yellow-300 pb-6">
          Bienvenue sur EASY-MEMBERSHIP
        </h1>
        <p className="text-white">
          <span className="font-bold text-yellow-300">Easy-membership</span> votre partenaire pour gérer vos tontines efficacement
        </p>
      </div>

      <h1 className="text-emerald-500 text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Membres */}
        <div className="bg-emerald-500 p-4 rounded-xl shadow">
          <p className="text-sm text-white font-semibold">Membres</p>
          <h2 className="text-yellow-300 text-2xl font-bold">{membersCount}</h2>
        </div>

        {/* Cotisations */}
        <div className="bg-indigo-500 p-4 rounded-xl shadow">
          <p className="text-sm text-white font-semibold">Cotisations</p>
          <h2 className="text-yellow-300 text-2xl font-bold">
            {paymentsTotal.toLocaleString()} FCFA
          </h2>
        </div>

        {/* Événements */}
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <p className="text-emerald-500 text-sm font-semibold">Événements à venir</p>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((ev) => (
              <div key={ev._id} className="mb-2">
                <h2 className="text-lg font-semibold">{ev.title}</h2>
                <p className="text-sm">
                  Date: {new Date(ev.date).toLocaleDateString()} | Participants:{" "}
                  {ev.participants.length}/{ev.capacity} ({fillRate(ev)}% rempli)
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm">Aucun événement à venir</p>
          )}
        </div>
      </div>
    </div>
  );
}