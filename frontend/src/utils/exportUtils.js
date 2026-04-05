import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel(data, filename, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `${filename}.xlsx`);
}

export function exportToPDF(title, headers, rows) {
  const w = window.open("", "_blank");
  if (!w) return;
  const table = `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;width:100%">
    <thead><tr style="background:#1E3A8A;color:#fff">${headers.map((h) => `<th style="padding:8px 12px;text-align:left">${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr style="background:${i % 2 ? "#F8FAFC" : "#fff"}">${r.map((c) => `<td style="padding:6px 12px">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>@media print{body{margin:0}}</style></head><body>
    <div style="padding:20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="width:40px;height:40px;background:#F26522;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:18px">ओ</div>
        <div><h1 style="margin:0;font-size:20px;color:#1E3A8A">${title}</h1><p style="margin:2px 0 0;font-size:12px;color:#64748B">Odisha Vision 2047 - Generated ${new Date().toLocaleDateString()}</p></div>
      </div>
      ${table}
    </div>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}
