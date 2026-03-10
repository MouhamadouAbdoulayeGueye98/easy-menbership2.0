export default function Dashboard() {
  return (
    <div className="">
      <div className="bg-emerald-500 rounded-xl p-6 text-center mb-4">
        <h1 className="text-4xl font-bold text-yellow-300 pb-6">Bienvenue sur EASY-MEMBERSHIP</h1>
        <p className="text-white"><span className="font-bold text-yellow-300">Easy-membership</span> votre partenaire pour gére vos tontines de maniere efficace et professionnel</p>
      </div>
      <h1 className="text-emerald-500 text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500 p-4 rounded-xl shadow">
          <p className="text-sm text-white font-semibold">Membres</p>
          <h2 className="text-yellow-300 text-2xl font-bold">120</h2>
        </div>

        <div className="bg-indigo-500 p-4 rounded-xl shadow">
          <p className="text-sm text-white font-semibold">Cotisations</p>
          <h2 className="text-yellow-300 text-2xl font-bold">360 000 FCFA</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <p className="text-emerald-500 text-sm font-semibold">Événements à venir</p>
          <h2 className="text-lg font-semibold">Assemblée Générale - 30 Oct</h2>
        </div>
      </div>
    </div>
  );
}
