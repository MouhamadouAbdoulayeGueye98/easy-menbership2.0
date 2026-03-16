import { useState, useEffect } from "react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://easy-menbership2-0-backend.onrender.com/members";

  // Charger les membres
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setMembers(data);

        localStorage.setItem("members", JSON.stringify(data));
      } catch {
        const local = localStorage.getItem("members");
        if (local) setMembers(JSON.parse(local));
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  // Ajouter ou modifier membre
  const addMember = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const status = e.target.status.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const address = e.target.address.value;

    const newMember = {
      _id: editMember ? editMember._id : Date.now().toString(),
      name,
      status,
      phone,
      email,
      address,
      payments: editMember?.payments || Array(12).fill(false),
    };

    if (editMember) {
      setMembers((prev) =>
        prev.map((m) => (m._id === editMember._id ? newMember : m))
      );
      setEditMember(null);
    } else {
      setMembers((prev) => [...prev, newMember]);
    }

    try {
      await fetch(API, {
        method: editMember ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
    } catch {
      console.log("API indisponible → mode local");
    }

    setShowModal(false);
  };

  // Supprimer membre
  const deleteMember = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce membre ?")) return;

    setMembers((prev) => prev.filter((m) => m._id !== id));

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
    } catch {
      console.log("Suppression locale");
    }

    if (detailMember?._id === id) setDetailMember(null);
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-emerald-500">Membres</h1>

        <div className="relative w-full sm:w-64">
          <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 pl-9 border rounded-lg w-full"
          />
        </div>

        <button
          onClick={() => {
            setEditMember(null);
            setShowModal(true);
          }}
          className="text-white px-4 py-2 rounded-lg"
          style={{ backgroundColor: "#2563eb" }}
        >
          + Ajouter
        </button>
      </div>

      {/* Liste membres */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{member.name}</p>

              <span
                style={{
                  color: member.status === "Actif" ? "#16a34a" : "#6b7280",
                }}
              >
                {member.status === "Actif" ? "✅ Actif" : "❌ Inactif"}
              </span>
            </div>

            <div className="flex gap-3 text-lg">
              <AiOutlineEye
                className="cursor-pointer text-blue-600"
                onClick={() => setDetailMember(member)}
              />

              <AiOutlineEdit
                className="cursor-pointer text-yellow-600"
                onClick={() => {
                  setEditMember(member);
                  setShowModal(true);
                }}
              />

              <AiOutlineDelete
                className="cursor-pointer text-red-600"
                onClick={() => deleteMember(member._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajouter / Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <form
            onSubmit={addMember}
            className="bg-white p-6 rounded-xl w-full max-w-sm"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              {editMember ? "Modifier membre" : "Nouveau membre"}
            </h2>

            <input
              name="name"
              placeholder="Nom complet"
              defaultValue={editMember?.name || ""}
              className="w-full mb-3 p-3 border rounded-lg"
              required
            />

            <input
              name="phone"
              placeholder="Numéro téléphone"
              defaultValue={editMember?.phone || ""}
              className="w-full mb-3 p-3 border rounded-lg"
            />

            <input
              name="email"
              placeholder="Adresse email"
              defaultValue={editMember?.email || ""}
              className="w-full mb-3 p-3 border rounded-lg"
            />

            <input
              name="address"
              placeholder="Adresse"
              defaultValue={editMember?.address || ""}
              className="w-full mb-4 p-3 border rounded-lg"
            />

            <label className="block mb-4 text-gray-700 font-semibold">
              Statut :
              <select
                name="status"
                defaultValue={editMember?.status || "Actif"}
                className="w-full mt-1 p-3 border rounded-lg"
              >
                <option value="Actif">✅ Actif</option>
                <option value="Inactif">❌ Inactif</option>
              </select>
            </label>

            <button
              type="submit"
              className="w-full text-white p-3 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700"
            >
              {editMember ? "Modifier" : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditMember(null);
              }}
              className="w-full mt-2 bg-gray-300 p-2 rounded"
            >
              Annuler
            </button>
          </form>
        </div>
      )}

      {/* Modal Détails */}
      {detailMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              Détails de {detailMember.name}
            </h2>

            <p className="mb-2">
              Statut :{" "}
              <span
                style={{
                  color:
                    detailMember.status === "Actif"
                      ? "#16a34a"
                      : "#6b7280",
                }}
              >
                {detailMember.status}
              </span>
            </p>

            <p className="mb-2">
              📞 Téléphone : {detailMember.phone || "Non renseigné"}
            </p>

            <p className="mb-2">
              📧 Email : {detailMember.email || "Non renseigné"}
            </p>

            <p className="mb-2">
              📍 Adresse : {detailMember.address || "Non renseigné"}
            </p>

            <p className="mb-2">
              Cotisations payées :{" "}
              {detailMember.payments.filter((p) => p).length} / 12
            </p>

            <div className="flex justify-end gap-3 mt-4 text-lg">
              <AiOutlineEdit
                className="cursor-pointer text-yellow-600"
                onClick={() => {
                  setEditMember(detailMember);
                  setShowModal(true);
                  setDetailMember(null);
                }}
              />

              <AiOutlineDelete
                className="cursor-pointer text-red-600"
                onClick={() => deleteMember(detailMember._id)}
              />

              <AiOutlineClose
                className="cursor-pointer text-gray-600"
                onClick={() => setDetailMember(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}