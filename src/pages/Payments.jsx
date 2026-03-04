import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdOutlineSaveAlt } from "react-icons/md";

const months = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

export default function PaymentsByMonth() {
  const year = new Date().getFullYear();

  const [members] = useState([
    { _id: "1", name: "Aminata Gueye"},
    { _id: "2", name: "Hawa Ndiaye"},
    { _id: "3", name: "Ibrahima Ngom"},
    { _id: "4", name: "Marietou Gueye"},
    { _id: "5", name: "Lobé Seck"},
    { _id: "6", name: "Kaw Kaw"},
  ]);

  const [payments, setPayments] = useState([
    { _id: "p1", memberId: "3", month: 1, year, amount: 5000 },
    { _id: "p2", memberId: "1", month: 3, year, amount: 5000 },
    { _id: "p3", memberId: "2", month: 2, year, amount: 5000 },
    { _id: "p4", memberId: "6", month: 4, year, amount: 5000 },
    { _id: "p3", memberId: "4", month: 2, year, amount: 5000 },
    { _id: "p3", memberId: "5", month: 3, year, amount: 5000 },
  ]);

  const hasPaid = (memberId, monthIndex) => {
    return payments.find(
      p => p.memberId === memberId && p.month === monthIndex && p.year === year
    );
  };

  const togglePayment = (memberId, monthIndex) => {
    const existing = hasPaid(memberId, monthIndex);
    if (existing) {
      setPayments(prev => prev.filter(p => p._id !== existing._id));
    } else {
      const newPayment = {
        _id: Date.now().toString(),
        memberId,
        month: monthIndex,
        year,
        amount: 5000
      };
      setPayments(prev => [...prev, newPayment]);
    }
  };

  const getTotalByMember = (memberId) => {
    return payments
      .filter(p => p.memberId === memberId && p.year === year)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalByMonth = (monthIndex) => {
    return payments
      .filter(p => p.month === monthIndex && p.year === year)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const totalGeneral = payments
    .filter(p => p.year === year)
    .reduce((sum, p) => sum + p.amount, 0);

  const exportPDF = () => {
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
      styles: { fontSize: 10 },
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
                <th key={idx} className="p-2 border border-gray-300">
                  {m}
                </th>
              ))}
              <th className="p-2 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300 font-semibold">
                  {member.name}
                </td>
                {months.map((_, idx) => {
                  const paid = hasPaid(member._id, idx);
                  return (
                    <td
                      key={idx}
                      className={`p-2 border border-gray-300 text-center cursor-pointer ${paid ? "bg-green-100" : "bg-white"}`}
                      onClick={() => togglePayment(member._id, idx)}
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
                <td
                  key={idx}
                  className="p-2 border border-gray-300 text-center"
                >
                  {getTotalByMonth(idx).toLocaleString()}
                </td>
              ))}
              <td className="p-2 border border-gray-300 text-center">
                {totalGeneral.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}