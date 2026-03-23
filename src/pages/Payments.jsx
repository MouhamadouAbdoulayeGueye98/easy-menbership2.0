import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdOutlineSaveAlt } from "react-icons/md";

const months = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

export default function PaymentsByMonth() {
  const year = new Date().getFullYear();

  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({ memberId: "", monthIndex: 0, amount: 0 });

  const MEMBERS_API = "http://localhost:5000/members";
  const PAYMENTS_API = "http://localhost:5000/payments";

  // Charger les membres
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(MEMBERS_API);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMembers();
  }, []);

  // Charger les paiements
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await fetch(PAYMENTS_API);
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadPayments();
  }, []);

  // Vérifie si un membre a payé pour un mois
  const hasPaid = (memberId, monthIndex) => {
    return payments.find(
      p => p.member._id === memberId && p.month === monthIndex && p.year === year
    );
  };

  // Cliquer sur cellule → ouvrir modal
  const handleCellClick = (memberId, monthIndex) => {
    const existing = hasPaid(memberId, monthIndex);
    setSelectedPayment({
      memberId,
      monthIndex,
      amount: existing ? existing.amount : 0
    });
    setShowPaymentModal(true);
  };

  // Confirmer paiement
  const confirmPayment = async () => {
    const { memberId, monthIndex, amount } = selectedPayment;
    if (!amount || amount <= 0) return;

    const existing = hasPaid(memberId, monthIndex);

    if (existing) {
      alert("Ce membre a déjà payé pour ce mois !");
      setShowPaymentModal(false);
      return;
    } else {
      try {
        const res = await fetch(PAYMENTS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId, month: monthIndex, year, amount })
        });
        const newPayment = await res.json();
        setPayments(prev => [...prev, newPayment]);
      } catch (err) { console.error(err); }
    }

    setShowPaymentModal(false);
  };

  // Supprimer paiement
  const deletePayment = async (paymentId) => {
    try {
      await fetch(`${PAYMENTS_API}/${paymentId}`, { method: "DELETE" });
      setPayments(prev => prev.filter(p => p._id !== paymentId));
    } catch (err) {
      console.error(err);
    }
  };

  // Totaux
  const getTotalByMember = (memberId) =>
    payments.filter(p => p.member._id === memberId && p.year === year)
            .reduce((sum, p) => sum + p.amount, 0);

  const getTotalByMonth = (monthIndex) =>
    payments.filter(p => p.month === monthIndex && p.year === year)
            .reduce((sum, p) => sum + p.amount, 0);

  const totalGeneral = payments.filter(p => p.year === year)
                               .reduce((sum, p) => sum + p.amount, 0);

  // Export PDF
  const exportPDF = () => {
    if (!members.length) return alert("Aucun membre disponible pour exporter !");

    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("EASY-MEMBERSHIP", 14, 15);
    doc.setFontSize(16);
    doc.text(`Cotisations Année ${year}`, 14, 25);
    doc.setFontSize(10);
    doc.text(`Date d'export : ${new Date().toLocaleDateString()}`, 14, 32);

    const tableColumn = ["Membre", ...months, "Total"];
    const tableRows = [];

    members.forEach(member => {
      const row = [];
      row.push(member.name);
      months.forEach((_, idx) => {
        const paid = hasPaid(member._id, idx);
        row.push(paid ? paid.amount : "");
      });
      row.push(getTotalByMember(member._id));
      tableRows.push(row);
    });

    const totalRow = ["Total"];
    months.forEach((_, idx) => totalRow.push(getTotalByMonth(idx)));
    totalRow.push(totalGeneral);
    tableRows.push(totalRow);

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10, cellWidth: "wrap" },
      headStyles: { fillColor: [30, 144, 255], textColor: 255 },
      bodyStyles: { fillColor: [245, 245, 245] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      didParseCell: (data) => {
        const rowIndex = data.row.index;
        const colIndex = data.column.index;
        if (rowIndex < members.length) {
          const member = members[rowIndex];
          const paid = hasPaid(member._id, colIndex - 1);
          if (paid && colIndex > 0 && colIndex <= months.length) {
            data.cell.styles.fillColor = [198, 239, 206];
          }
        }
        if (rowIndex === members.length) {
          data.cell.styles.fillColor = [200, 200, 200];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    doc.setFontSize(12);
    doc.text(
      "Trésorier : ____________________",
      doc.internal.pageSize.getWidth() - 80,
      doc.lastAutoTable.finalY + 20
    );

    doc.save(`Cotisations_${year}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Cotisations {year}</h2>
        <button
          onClick={exportPDF}
          className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          title="Exporter en PDF"
        >
          <MdOutlineSaveAlt size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="p-2 border border-gray-300 text-left">Membre</th>
              {months.map((m, idx) => (
                <th key={idx} className="p-2 border border-gray-300">{m}</th>
              ))}
              <th className="p-2 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300 font-semibold">{member.name}</td>
                {months.map((_, idx) => {
                  const paid = hasPaid(member._id, idx);
                  return (
                    <td
                      key={idx}
                      className={`p-2 border border-gray-300 text-center cursor-pointer ${paid ? "bg-green-100" : "bg-white"}`}
                      onClick={() => handleCellClick(member._id, idx)}
                    >
                      {paid ? paid.amount.toLocaleString() : ""}
                    </td>
                  );
                })}
                <td className="p-2 border border-gray-300 font-bold bg-gray-200 text-center">
                  {getTotalByMember(member._id).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-300 font-bold">
              <td className="p-2 border border-gray-300">Total</td>
              {months.map((_, idx) => (
                <td key={idx} className="p-2 border border-gray-300 text-center">
                  {getTotalByMonth(idx).toLocaleString()}
                </td>
              ))}
              <td className="p-2 border border-gray-300 text-center">{totalGeneral.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal pour saisir le montant */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Saisir le montant</h2>
            <input
              type="number"
              value={selectedPayment.amount}
              onChange={(e) =>
                setSelectedPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) }))
              }
              className="w-full mb-4 p-3 border rounded-lg"
              min="1000"
              step="1000"
              placeholder="Montant payé"
            />
            <button
              onClick={confirmPayment}
              className="w-full text-white p-3 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 mb-2"
            >
              Confirmer
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full bg-gray-300 p-2 rounded"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}