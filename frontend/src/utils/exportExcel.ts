import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

export async function exportMovimentacoesExcel(movs: any[], filename: string) {
  if (!movs || movs.length === 0) {
    alert("Nenhuma movimentação para exportar.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(movs);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movimentações");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const platform = Capacitor.getPlatform();
  const isNative = platform === "android" || platform === "ios";

  if (isNative) {
    try {
      const base64Data = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
      });

      alert(`📂 Arquivo salvo no tablet: ${result.uri}`);
      console.log("Arquivo salvo em:", result.uri);
    } catch (err) {
      console.error("❌ Erro ao salvar no tablet:", err);
      fallbackWeb(excelBuffer, filename);
    }
  } else {
    fallbackWeb(excelBuffer, filename);
  }
}

function fallbackWeb(excelBuffer: any, filename: string) {
  try {
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  } catch (err) {
    console.error("❌ Erro ao salvar no navegador:", err);
    alert("Não foi possível exportar o arquivo.");
  }
}
