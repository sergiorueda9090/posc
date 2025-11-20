import React from "react";
import { Button, Stack } from "@mui/material";
import { PictureAsPdf, TableView } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ExportButtons = ({ data }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("📊 Reporte de Ventas", 14, 20);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 30);

    const resumen = data.resumen_general;
    autoTable(doc, {
      startY: 40,
      head: [["Concepto", "Valor"]],
      body: [
        ["Total Ventas", resumen.total_ventas],
        ["Descuentos", resumen.total_descuentos],
        ["Impuestos", resumen.total_impuestos],
        ["Cantidad Ventas", resumen.cantidad_ventas],
      ],
    });
    doc.save("reporte_ventas.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data.detalle_ventas);
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout]), "reporte_ventas.xlsx");
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="error"
        startIcon={<PictureAsPdf />}
        onClick={exportPDF}
      >
        Exportar PDF
      </Button>
      <Button
        variant="contained"
        color="success"
        startIcon={<TableView />}
        onClick={exportExcel}
      >
        Exportar Excel
      </Button>
    </Stack>
  );
};
