import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const RemitosApp = () => {
  // Estado principal
  const [numeroOrden, setNumeroOrden] = useState('36045');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remito, setRemito] = useState(null);
  const [remitos, setRemitos] = useState([]);
  const [numeroRemito, setNumeroRemito] = useState(1001);

  // Datos de la empresa
  const empresa = {
    razonSocial: 'TALLERES GRÁFICOS DEL NORTE S.R.L.',
    cuit: '30-70897696-9',
    domicilio: 'Perú 1011, 1602 - Florida (Buenos Aires)',
    telefono: '(+54) 11 4511-xxxx',
    email: 'info@tgnorte.com.ar',
    sitioWeb: 'www.tgnorte.com.ar'
  };

  // Simulador de scraping (después conectamos con Playwright real)
  const scrapearOrden = async (nroOrden) => {
    setLoading(true);
    setError(null);

    try {
      // Simulamos un delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos de ejemplo basados en lo que vimos en Smartier
      const datosOrden = {
        numero: nroOrden,
        cliente: {
          nombre: 'Loreal',
          contacto: 'Natalia Nuñez',
          cuit: '30-65017345-8'
        },
        fechaCreacion: '14/05/2026',
        fechaEntrega: '12/06/2026',
        producto: 'Glorificador Serum Glyco',
        cantidad: '200 unidades',
        descripcion: 'Acrílico 2mm - Armado de impresoras cama plana UV Xerox XJ 180cm',
        notasEntrega: 'Entrega de 200 ejemplares desde Principal. Dirección a confirmar.',
        estado: 'Archivos recibidos'
      };

      setRemito(datosOrden);
    } catch (err) {
      setError('Error al scrapear la orden. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generar remito
  const generarRemito = () => {
    if (!remito) {
      setError('Primero debes scrapear una orden');
      return;
    }

    const nuevoRemito = {
      id: numeroRemito,
      orden: remito.numero,
      cliente: remito.cliente.nombre,
      fecha: new Date().toLocaleDateString('es-AR'),
      producto: remito.producto,
      cantidad: remito.cantidad,
      generado: new Date().toLocaleTimeString('es-AR')
    };

    setRemitos([nuevoRemito, ...remitos]);
    setNumeroRemito(numeroRemito + 1);
    setRemito(null);
    setError(null);
  };

  // Imprimir remito
  const imprimirRemito = (remitoData) => {
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Remito ${remitoData.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
          }
          .container {
            width: 210mm;
            height: 297mm;
            background: white;
            margin: 20px auto;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1a3a52;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .empresa-info h1 {
            font-size: 24px;
            font-weight: bold;
            color: #1a3a52;
            margin-bottom: 5px;
          }
          .empresa-info p {
            font-size: 12px;
            color: #666;
            margin: 2px 0;
          }
          .remito-titulo {
            text-align: right;
          }
          .remito-numero {
            font-size: 36px;
            font-weight: bold;
            color: #1a3a52;
            margin-bottom: 5px;
          }
          .remito-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1a3a52;
            border-bottom: 2px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 15px;
            letter-spacing: 1px;
          }
          
          .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .campo {
            margin-bottom: 15px;
          }
          .label {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }
          .valor {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
          
          .productos {
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
          }
          .tabla-header {
            background: #f9f9f9;
            border-bottom: 2px solid #1a3a52;
            display: grid;
            grid-template-columns: 1fr 1fr 150px;
            padding: 12px;
            font-size: 11px;
            font-weight: bold;
            color: #1a3a52;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .tabla-fila {
            display: grid;
            grid-template-columns: 1fr 1fr 150px;
            padding: 15px 12px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .tabla-fila:last-child {
            border-bottom: none;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            font-size: 11px;
            color: #999;
            text-align: center;
          }
          
          .pie {
            margin-top: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            font-size: 10px;
            text-align: center;
            color: #999;
          }
          
          @media print {
            body { background: white; }
            .container { margin: 0; padding: 20px; box-shadow: none; }
            * { -webkit-print-color-adjust: exact; color-adjust: exact; }
          }
          
          .print-btn {
            display: none;
          }
          @media print {
            .print-btn { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- HEADER -->
          <div class="header">
            <div class="empresa-info">
              <h1>${empresa.razonSocial}</h1>
              <p>CUIT: ${empresa.cuit}</p>
              <p>${empresa.domicilio}</p>
              <p>📞 ${empresa.telefono} | 📧 ${empresa.email}</p>
            </div>
            <div class="remito-titulo">
              <div class="remito-numero">Remito #${remitoData.id}</div>
              <div class="remito-label">Nota de Entrega</div>
            </div>
          </div>

          <!-- FECHAS Y REFERENCIAS -->
          <div class="two-columns">
            <div>
              <div class="campo">
                <div class="label">Orden Smartier</div>
                <div class="valor">#${remitoData.orden}</div>
              </div>
              <div class="campo">
                <div class="label">Fecha de Remito</div>
                <div class="valor">${remitoData.fecha}</div>
              </div>
            </div>
            <div>
              <div class="campo">
                <div class="label">Cliente</div>
                <div class="valor">${remitoData.cliente}</div>
              </div>
              <div class="campo">
                <div class="label">Generado</div>
                <div class="valor">${remitoData.generado}</div>
              </div>
            </div>
          </div>

          <!-- PRODUCTOS -->
          <div class="section">
            <div class="section-title">Productos/Servicios</div>
            <div class="productos">
              <div class="tabla-header">
                <div>Descripción</div>
                <div>Especificaciones</div>
                <div>Cantidad</div>
              </div>
              <div class="tabla-fila">
                <div>${remitoData.producto}</div>
                <div>Acrílico 2mm - Impresión digital</div>
                <div style="text-align: right;">${remitoData.cantidad}</div>
              </div>
            </div>
          </div>

          <!-- FIRMA Y PIE -->
          <div class="footer">
            <p style="margin-bottom: 30px; font-style: italic; color: #666;">
              Remito generado automáticamente por sistema TG Norte - ${new Date().toLocaleDateString()}
            </p>
            <div class="pie">
              <div>
                <p style="margin-bottom: 30px;">_______________</p>
                Entregado por
              </div>
              <div>
                <p style="margin-bottom: 30px;">_______________</p>
                Recibido por
              </div>
              <div>
                <p style="margin-bottom: 30px;">_______________</p>
                Autorizado por
              </div>
            </div>
          </div>
        </div>

        <button class="print-btn" onclick="window.print()" style="padding: 10px 20px; margin: 20px; background: #1a3a52; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
          Imprimir / Guardar como PDF
        </button>

        <script>
          window.addEventListener('load', () => {
            // Auto-print si se abre desde el app
            // window.print();
          });
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <!-- HEADER APP -->
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Generador de Remitos</h1>
          </div>
          <p className="text-slate-400">TALLERES GRÁFICOS DEL NORTE - Sistema de remitos automatizado</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <!-- PANEL IZQUIERDO: SCRAPER -->
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Scrapear Orden de Smartier
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Orden
                  </label>
                  <input
                    type="text"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    placeholder="Ej: 36045"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => scrapearOrden(numeroOrden)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scrapeando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Scrapear Orden
                    </>
                  )}
                </button>
              </div>

              <!-- Mensajes -->
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <!-- Datos Scrapeados -->
              {remito && (
                <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Orden Scrapeada
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 font-semibold">Orden</p>
                      <p className="text-slate-900 font-mono">#{remito.numero}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-semibold">Cliente</p>
                      <p className="text-slate-900">{remito.cliente.nombre}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-semibold">Producto</p>
                      <p className="text-slate-900">{remito.producto}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-semibold">Cantidad</p>
                      <p className="text-slate-900">{remito.cantidad}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-600 font-semibold">Entrega</p>
                      <p className="text-slate-900">{remito.fechaEntrega}</p>
                    </div>
                  </div>

                  <button
                    onClick={generarRemito}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    ✓ Generar Remito
                  </button>
                </div>
              )}
            </div>
          </div>

          <!-- PANEL DERECHO: STATS -->
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Remitos Generados</p>
                  <p className="text-4xl font-bold text-blue-600">{remitos.length}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Próximo Remito</p>
                  <p className="text-2xl font-bold text-slate-900">#{numeroRemito}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-slate-600 text-sm font-semibold mb-2">Últimos Remitos</p>
                  <div className="space-y-2 text-sm">
                    {remitos.slice(0, 5).map((r) => (
                      <div key={r.id} className="bg-slate-50 p-2 rounded flex justify-between items-center">
                        <span className="font-mono text-blue-600">#{r.id}</span>
                        <span className="text-slate-600">{r.cliente.substring(0, 12)}...</span>
                      </div>
                    ))}
                    {remitos.length === 0 && (
                      <p className="text-slate-500 italic">Sin remitos generados aún</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTADO DE REMITOS -->
        {remitos.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Remitos Generados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Remito</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Orden</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {remitos.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600">#{r.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">#{r.orden}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{r.cliente}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate">{r.producto}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.fecha}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => imprimirRemito(r)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                        >
                          Imprimir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemitosApp;
