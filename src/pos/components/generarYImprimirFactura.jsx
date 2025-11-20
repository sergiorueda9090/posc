export const generarYImprimirFactura = (saleData) => {
        const facturaHTML = `
            <html>
            <head>
                <title>Factura #${saleData.id}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        margin: 40px;
                        color: #333;
                    }
                    h1 {
                        text-align: center;
                        color: #262254;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border-bottom: 1px solid #ddd;
                        padding: 10px;
                    }
                    th {
                        background: #262254;
                        color: #fff;
                    }
                    tfoot td {
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .totales {
                        text-align: right;
                        margin-top: 30px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 13px;
                        margin-top: 40px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <h1>Factura de Venta</h1>
                <p><strong>ID Venta:</strong> ${saleData.id}</p>
                <p><strong>Fecha:</strong> ${saleData.date}</p>
                <p><strong>Cliente:</strong> ${saleData.client.name} (ID: ${saleData.client.id})</p>
                <p><strong>Método de Pago:</strong> ${saleData.method}</p>

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saleData.items.map(item => `
                            <tr>
                                <td>${item.nombre}</td>
                                <td style="text-align:center;">${item.quantity}</td>
                                <td style="text-align:right;">${formatCurrency(item.precio_final)}</td>
                                <td style="text-align:right;">${formatCurrency(item.precio_final * item.quantity)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div class="totales">
                    <p><strong>Total:</strong> ${saleData.total}</p>
                    <p><strong>Recibido:</strong> ${saleData.received}</p>
                    <p><strong>Cambio:</strong> ${saleData.change}</p>
                </div>

                <div class="footer">
                    <hr>
                    <p>¡Gracias por su compra!<br>Desarrollado por <strong>Tu Empresa de Software</strong></p>
                </div>
            </body>
            </html>
            `;

            // 🖨️ Abrir nueva ventana para imprimir
            const printWindow = window.open('', '_blank');
            printWindow.document.write(facturaHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
    };
