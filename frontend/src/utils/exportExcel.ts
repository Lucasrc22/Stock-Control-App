import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Filesystem, Directory } from "@capacitor/filesystem";

/**
 * Exporta movimentações para Excel.
 * Suporta tablet (nativo) via Capacitor e fallback para web.
 */
export async function exportMovimentacoesExcel(movs: any[], filename: string) {
  if (!movs || movs.length === 0) {
    alert("Nenhuma movimentação para exportar.");
    return;
  }

  if (!filename.endsWith(".xlsx")) filename += ".xlsx";

  const worksheet = XLSX.utils.json_to_sheet(movs);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movimentações");

  // Converte para base64
  const excelBase64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

  try {
    // **Não precisa definir encoding**
    const result = await Filesystem.writeFile({
      path: filename,
      data: excelBase64,
      directory: Directory.Documents,
      // encoding: "base64" // <- REMOVIDO
    });

    console.log("Arquivo salvo em:", result.uri);
    alert(`Arquivo salvo em: ${result.uri}`);
  } catch (err) {
    console.warn("Erro ao salvar nativo, usando fallback web", err);

    // fallback web
    try {
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, filename);
    } catch (webErr) {
      console.error("Erro ao salvar arquivo no navegador", webErr);
      alert("Não foi possível exportar o arquivo.");
    }
  }
}
