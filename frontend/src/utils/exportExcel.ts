import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportMovimentacoesExcel(movs: any[], filename: string) {
  if (!movs || movs.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(movs);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movimentações");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, filename);
}
