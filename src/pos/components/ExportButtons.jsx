import React from "react";
import { Button, Stack } from "@mui/material";
import { PictureAsPdf, TableView } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const fmtCOP = (val) => {
  const num = Number(val || 0);
  return num.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const ExportButtons = ({ data }) => {

  // ============================
  // PDF
  // ============================
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const resumen = data.resumen_general || {};
    const metodos = data.por_metodo_pago || [];
    const ventas = data.detalle_ventas || [];
    const totales = data.totales_tabla || {};
    const rango = data.rango_consulta || "";

    const checkPage = (needed) => {
      if (y > pageH - needed) { doc.addPage(); y = 15; }
    };

    let y = 15;

    // ========= PAGINA 1: RESUMEN =========
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Ventas", 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${rango}  |  Generado: ${new Date().toLocaleString("es-CO")}`, 14, y);
    y += 10;

    // Resumen general
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen General", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      theme: "grid",
      headStyles: { fillColor: [38, 34, 84], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      head: [["Total Ventas", "Total Descuentos", "Total Impuestos", "Cantidad Ventas", "Unidades Vendidas"]],
      body: [[
        fmtCOP(resumen.total_ventas),
        fmtCOP(resumen.total_descuentos),
        fmtCOP(resumen.total_impuestos),
        resumen.cantidad_ventas ?? 0,
        resumen.total_unidades_vendidas ?? 0,
      ]],
    });
    y = doc.lastAutoTable.finalY + 10;

    // Metodos de pago
    if (metodos.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Desglose por Metodo de Pago", 14, y);
      y += 2;

      autoTable(doc, {
        startY: y,
        theme: "grid",
        headStyles: { fillColor: [21, 101, 192], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        head: [["Metodo de Pago", "Total"]],
        body: metodos.map((m) => [m.metodo_pago, fmtCOP(m.total)]),
        tableWidth: 150,
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // ========= DETALLE: UNA SECCION POR VENTA =========
    ventas.forEach((venta, idx) => {
      // Cada venta necesita minimo 60px, si no cabe ir a nueva pagina
      checkPage(65);

      // --- Barra de titulo de la venta ---
      doc.setFillColor(38, 34, 84);
      doc.rect(14, y, pageW - 28, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(`Venta ${idx + 1} de ${ventas.length}  |  ${venta.codigo}  |  ${venta.fecha}`, 18, y + 5.5);
      doc.setTextColor(0, 0, 0);
      y += 12;

      // --- Info de la venta ---
      autoTable(doc, {
        startY: y,
        theme: "plain",
        styles: { fontSize: 8.5, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 22 },
          1: { cellWidth: 70 },
          2: { fontStyle: "bold", cellWidth: 22 },
          3: { cellWidth: 70 },
        },
        body: [
          ["Cliente:", venta.cliente, "Creado por:", venta.creado_por],
        ],
      });
      y = doc.lastAutoTable.finalY + 1;

      // --- Metodos de pago de esta venta ---
      const pagos = venta.pagos && venta.pagos.length > 0 ? venta.pagos : null;
      if (pagos) {
        autoTable(doc, {
          startY: y,
          theme: "grid",
          headStyles: { fillColor: [21, 101, 192], fontSize: 8, cellPadding: 2 },
          bodyStyles: { fontSize: 8, cellPadding: 2 },
          head: [["Metodo de Pago", "Monto", "Tarjeta / Cuenta"]],
          body: pagos.map((p) => [
            p.metodo_pago,
            fmtCOP(p.monto),
            p.tarjeta || "-",
          ]),
          tableWidth: 180,
        });
      } else {
        autoTable(doc, {
          startY: y,
          theme: "grid",
          headStyles: { fillColor: [21, 101, 192], fontSize: 8, cellPadding: 2 },
          bodyStyles: { fontSize: 8, cellPadding: 2 },
          head: [["Metodo de Pago", "Monto"]],
          body: [[venta.metodo_pago, fmtCOP(venta.total)]],
          tableWidth: 130,
        });
      }
      y = doc.lastAutoTable.finalY + 2;

      // --- Tabla de productos ---
      checkPage(30);
      autoTable(doc, {
        startY: y,
        theme: "striped",
        headStyles: { fillColor: [69, 90, 100], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
        body: (venta.productos_comprados || []).map((p) => [
          p.producto,
          p.cantidad,
          fmtCOP(p.precio_unitario),
          fmtCOP(p.subtotal_producto),
        ]),
      });
      y = doc.lastAutoTable.finalY + 1;

      // --- Totales de la venta ---
      autoTable(doc, {
        startY: y,
        theme: "plain",
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 50, halign: "right", fontStyle: "bold" },
          2: { cellWidth: 50, halign: "right", fontStyle: "bold" },
          3: { cellWidth: 50, halign: "right", fontStyle: "bold" },
        },
        body: [
          [
            "",
            `Subtotal: ${fmtCOP(venta.subtotal)}`,
            `Descuento: ${fmtCOP(venta.descuento)}`,
            `Impuesto: ${fmtCOP(venta.impuesto)}`,
          ],
          [
            "",
            "",
            { content: "TOTAL:", styles: { fontSize: 11, fontStyle: "bold", halign: "right" } },
            { content: fmtCOP(venta.total), styles: { fontSize: 11, fontStyle: "bold", halign: "right", textColor: [38, 34, 84] } },
          ],
        ],
      });
      y = doc.lastAutoTable.finalY + 4;

      // --- Linea separadora ---
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(14, y, pageW - 14, y);
      y += 6;
    });

    // ========= TOTALES GENERALES =========
    checkPage(30);

    doc.setFillColor(38, 50, 56);
    doc.rect(14, y, pageW - 28, 8, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTALES GENERALES", 18, y + 5.5);
    doc.setTextColor(0, 0, 0);
    y += 12;

    autoTable(doc, {
      startY: y,
      theme: "grid",
      headStyles: { fillColor: [38, 50, 56], fontSize: 10 },
      bodyStyles: { fontSize: 11, fontStyle: "bold" },
      head: [["Subtotal General", "Impuesto General", "Total General"]],
      body: [[
        fmtCOP(totales.subtotal_general),
        fmtCOP(totales.impuesto_general),
        fmtCOP(totales.total_general),
      ]],
    });

    doc.save("reporte_ventas.pdf");
  };

  // ============================
  // EXCEL
  // ============================
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const resumen = data.resumen_general || {};
    const metodos = data.por_metodo_pago || [];
    const ventas = data.detalle_ventas || [];
    const totales = data.totales_tabla || {};

    // --- Hoja 1: Resumen ---
    const resumenRows = [
      ["RESUMEN GENERAL"],
      [],
      ["Concepto", "Valor"],
      ["Total Ventas", resumen.total_ventas],
      ["Total Descuentos", resumen.total_descuentos],
      ["Total Impuestos", resumen.total_impuestos],
      ["Cantidad Ventas", resumen.cantidad_ventas],
      ["Unidades Vendidas", resumen.total_unidades_vendidas],
      [],
      ["DESGLOSE POR METODO DE PAGO"],
      [],
      ["Metodo de Pago", "Total"],
      ...metodos.map((m) => [m.metodo_pago, m.total]),
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

    // --- Hoja 2: Detalle por Venta (cada venta separada) ---
    const detalleRows = [];

    ventas.forEach((v, idx) => {
      // Encabezado de la venta
      detalleRows.push([`VENTA ${idx + 1}: ${v.codigo}`]);
      detalleRows.push(["Cliente", v.cliente, "", "Fecha", v.fecha, "", "Creado por", v.creado_por]);
      detalleRows.push([]);

      // Metodos de pago de esta venta
      detalleRows.push(["Metodos de Pago:"]);
      if (v.pagos && v.pagos.length > 0) {
        detalleRows.push(["Metodo", "Monto", "Tarjeta / Cuenta"]);
        v.pagos.forEach((p) => {
          detalleRows.push([p.metodo_pago, p.monto, p.tarjeta || "-"]);
        });
      } else {
        detalleRows.push(["Metodo", "Monto"]);
        detalleRows.push([v.metodo_pago, v.total]);
      }
      detalleRows.push([]);

      // Productos
      detalleRows.push(["Productos:"]);
      detalleRows.push(["Producto", "Cantidad", "Precio Unitario", "Subtotal"]);
      (v.productos_comprados || []).forEach((p) => {
        detalleRows.push([p.producto, p.cantidad, p.precio_unitario, p.subtotal_producto]);
      });
      detalleRows.push([]);

      // Totales de la venta
      detalleRows.push(["", "Subtotal", "Descuento", "Impuesto", "TOTAL"]);
      detalleRows.push(["", v.subtotal, v.descuento, v.impuesto, v.total]);
      detalleRows.push([]);

      // Separador
      detalleRows.push(["────────────────────────────────────────────────────────────────"]);
      detalleRows.push([]);
    });

    // Totales generales
    detalleRows.push(["TOTALES GENERALES"]);
    detalleRows.push(["Subtotal General", "Impuesto General", "Total General"]);
    detalleRows.push([totales.subtotal_general, totales.impuesto_general, totales.total_general]);

    const wsDetalle = XLSX.utils.aoa_to_sheet(detalleRows);
    wsDetalle["!cols"] = [
      { wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
      { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle por Venta");

    // --- Hoja 3: Listado plano (para filtrar) ---
    const listRows = [
      ["Codigo", "Cliente", "Metodo Pago", "Pagos Detalle", "Subtotal", "Descuento", "Impuesto", "Total", "Fecha", "Creado por"],
    ];
    ventas.forEach((v) => {
      const pagosTexto = (v.pagos && v.pagos.length > 0)
        ? v.pagos.map(p => `${p.metodo_pago}: $${Number(p.monto).toLocaleString("es-CO")}${p.tarjeta ? ` (${p.tarjeta})` : ""}`).join(" | ")
        : v.metodo_pago;
      listRows.push([v.codigo, v.cliente, v.metodo_pago, pagosTexto, v.subtotal, v.descuento, v.impuesto, v.total, v.fecha, v.creado_por]);
    });
    listRows.push([]);
    listRows.push(["", "", "", "TOTALES", totales.subtotal_general, "", totales.impuesto_general, totales.total_general]);

    const wsList = XLSX.utils.aoa_to_sheet(listRows);
    wsList["!cols"] = [
      { wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 45 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, wsList, "Listado Ventas");

    // --- Hoja 4: Metodos de Pago ---
    const metodosRows = [
      ["Metodo de Pago", "Total"],
      ...metodos.map((m) => [m.metodo_pago, m.total]),
    ];
    const wsMetodos = XLSX.utils.aoa_to_sheet(metodosRows);
    wsMetodos["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsMetodos, "Metodos de Pago");

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
