import { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export default function Events() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Assemblée Générale",
      date: "2026-10-30",
      capacity: 10,
      participants: [
        { name: "Alice", confirmed: true },
        { name: "Bob", confirmed: false },
      ],
    },
    {
      id: 2,
      title: "Réunion Bureau",
      date: "2026 -11-15",
      capacity: 5,
      participants: [],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);


  // 📊 Taux de remplissage
  const fillRate = (event) => {
    if (!event.capacity) return 0;
    return Math.min(
      100,
      Math.round((event.participants.length / event.capacity) * 100)
    );
  };

  // ✅ Taux de présence
  const presenceRate = (event) => {
    const total = event.participants.length;
    if (total === 0) return 0;
    const confirmed = event.participants.filter((p) => p.confirmed).length;
    return Math.round((confirmed / total) * 100);
  };

  // Ajouter ou modifier un événement
  const addOrEditEvent = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const date = e.target.date.value;
    const capacity = Number(e.target.capacity.value);

    if (editEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editEvent.id ? { ...ev, title, date, capacity } : ev
        )
      );
      setEditEvent(null);
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Date.now(),
          title,
          date,
          capacity,
          participants: [],
        },
      ]);
    }

    setShowModal(false);
  };

  // Supprimer un événement
  const openDeleteModal = (event) => {
    setEventToDelete(event);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
    }
    setDeleteModal(false);
    setEventToDelete(null);
  };


  // Ajouter un participant
  const addParticipant = (eventId, name) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          if (ev.participants.length >= ev.capacity) {
            alert("Capacité maximale atteinte 🚫");
            return ev;
          }
          return {
            ...ev,
            participants: [...ev.participants, { name, confirmed: false }],
          };
        }
        return ev;
      })
    );
  };

  // confirmation
  const toggleConfirmation = (eventId, participantIndex) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const participants = ev.participants.map((p, i) =>
            i === participantIndex
              ? { ...p, confirmed: !p.confirmed }
              : p
          );
          return { ...ev, participants };
        }
        return ev;
      })
    );
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="pb-20 p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-emerald-600">
          Gestion des Événements
        </h1>
        <button
          onClick={() => {
            setEditEvent(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {sortedEvents.map((event) => {
          const fill = fillRate(event);
          const presence = presenceRate(event);
          const confirmedCount = event.participants.filter(
            (p) => p.confirmed,
          ).length;
          const isFull = fill === 100;

          return (
            <div
              key={event.id}
              className="bg-white p-5 rounded-xl shadow-md border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-sm text-blue-600">{event.date}</p>

                  {isFull && (
                    <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full mt-2">
                      COMPLET
                    </span>
                  )}

                  {/* 📊 Remplissage */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-3 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${fill}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-700">
                    📊 {fill}% de remplissage ({event.participants.length}/
                    {event.capacity})
                  </p>

                  {/* ✅ Présence */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${presence}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-700">
                    ✅ {presence}% de présence ({confirmedCount}/
                    {event.participants.length})
                  </p>
                </div>

                <div className="flex gap-3 text-xl ml-4">
                  <AiOutlineEdit
                    className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                    onClick={() => {
                      setEditEvent(event);
                      setShowModal(true);
                    }}
                  />
                  <AiOutlineDelete
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => openDeleteModal(event)}
                  />
                </div>
              </div>

              {/* Participants */}
              <div className="mt-4">
                <p className="font-medium">Participants :</p>
                {event.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <span>{p.name}</span>
                    <button
                      onClick={() => toggleConfirmation(event.id, i)}
                      className={`px-2 py-1 rounded text-xs text-white ${
                        p.confirmed ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    >
                      {p.confirmed ? "Présent" : "Invité"}
                    </button>
                  </div>
                ))}

                {/* Ajouter participant */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addParticipant(event.id, e.target.name.value);
                    e.target.reset();
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    name="name"
                    placeholder="Nom participant"
                    className="border rounded px-2 py-1 text-sm flex-1"
                    required
                  />
                  <button
                    type="submit"
                    disabled={event.participants.length >= event.capacity}
                    className={`px-3 py-1 rounded text-sm text-white ${
                      event.participants.length >= event.capacity
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Ajouter
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={addOrEditEvent}
            className="bg-white p-6 rounded-xl w-full max-w-sm"
          >
            <h2 className="text-lg font-bold mb-4">
              {editEvent ? "Modifier événement" : "Nouveau événement"}
            </h2>

            <input
              name="title"
              placeholder="Titre"
              defaultValue={editEvent?.title || ""}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="date"
              name="date"
              defaultValue={editEvent?.date || ""}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacité maximale"
              defaultValue={editEvent?.capacity || 10}
              className="w-full mb-4 p-2 border rounded"
              min="1"
              required
            />

            <button className="w-full mb-2 bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700">
              {editEvent ? "Modifier" : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditEvent(null);
              }}
              className="w-full flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Confirmer la suppression
            </h2>

            <p className="text-gray-700 mb-6">
              Voulez-vous vraiment supprimer
              <span className="font-semibold"> {eventToDelete?.title}</span> ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Supprimer
              </button>

              <button
                onClick={() => {
                  setDeleteModal(false);
                  setEventToDelete(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
