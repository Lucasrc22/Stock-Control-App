import { saveAs } from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/**
 * Exporta movimentações para CSV.
 * Suporta Web (download direto) e Android/iOS (via Capacitor).
 */
export async function exportMovimentacoesCSV(
  movs: any[],
  filename: string
) {
  if (!movs || movs.length === 0) {
    alert("Nenhuma movimentação para exportar.");
    return;
  }
  if (!filename.endsWith(".csv")) filename += ".csv";

  // 1) Gerar CSV
  const headers = Object.keys(movs[0]);
  const rows = movs.map((row) =>
    headers.map((h) => `"${row[h] ?? ""}"`).join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");

  // 2) Detectar plataforma
  const platform = Capacitor.getPlatform();
  const isNative = platform === "android" || platform === "ios";

  if (isNative) {
    try {
      // Converter para Base64 seguro
      const base64Data = btoa(
        String.fromCharCode(...new TextEncoder().encode(csvContent))
      );

      // Salvar no diretório apropriado
      await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents, // mais seguro que ExternalStorage
      });

      const uri = await Filesystem.getUri({
        path: filename,
        directory: Directory.Documents,
      });

      // Compartilhar/Abrir
      await Share.share({
        title: "Movimentações",
        text: "Arquivo CSV exportado",
        url: uri.uri,
        dialogTitle: "Abrir ou compartilhar",
      });

      console.log("Arquivo salvo:", uri.uri);
      return;
    } catch (err) {
      console.error("Erro ao salvar no dispositivo, usando fallback web:", err);
    }
  }

  // 3) Fallback web (navegador) - com BOM p/ Excel
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  saveAs(blob, filename);
}
