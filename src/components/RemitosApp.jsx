import React, { useState } from 'react';
import { FileText, Download, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const empresa = {
  razonSocial: 'TALLERES GRÁFICOS DEL NORTE S.R.L.',
  cuit: '30-70897696-9',
  domicilio: 'Perú 1011, 1602 - Florida (Buenos Aires)',
  telefono: '(+54) 11 4511-xxxx',
  email: 'info@tgnorte.com.ar',
};

const SMARTIER_BASE = 'https://talleresgraficosdelnorte.smartier.software';

const parsearOrdenDesdeHTML = (htmlText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const texto = (selector) => {
    const el = doc.querySelector(selector);
    return el ? el.textContent.trim() : '';
  };
  const numero = texto('.numero.ng-binding').replace('N°', '').trim();
  const cliente = texto('.nombre-cliente.ng-binding');
  const representante = texto('.nombre-representante.ng-binding');
  const producto = texto('.nombre-producto.ng-binding');
  const referencia = texto('.referencia.ng-binding');
  const descEl = doc.querySelector('.st-card-content.ng-binding');
  const descripcion = descEl ? (descEl.innerText || descEl.textContent).trim().slice(0, 400) : '';
  const fechaEls = doc.querySelectorAll('.fecha-value.ng-binding');
  const fechaCreacion = fechaEls[0] ? fechaEls[0].textContent.trim() : '';
  const fechaEntrega = fechaEls[1] ? fechaEls[1].textContent.trim() : '';
  const direccion = texto('.comentarios .ng-binding');
  const estado = texto('.st-chip.estado-1');
  return {
    numero,
    cliente,
    representante,
    producto: referencia ? `${producto} - ${referencia}` : producto,
    descripcion,
    fechaCreacion,
    fechaEntrega,
    direccion,
    estado,
  };
};

const scrapearOrdenReal = async (numeroOrden) => {
  const url = `${SMARTIER_BASE}/#/CRM/Ordenes/${numeroOrden}`;
  const ventana = window.open(url, '_smartier_scraper', 'width=1,height=1,left=-9999');
  if (!ventana) throw new Error('El navegador bloqueó el popup. Habilitá los popups para este sitio.');
  await new Promise((r) => setTimeout(r, 7000));
  let html = '';
  try {
    html = ventana.document.body.innerHTML;
  } catch (e) {
    ventana.close();
    throw new Error('El navegador bloqueó el acceso entre ventanas (CORS). Necesitamos otra solución.');
  }
  ventana.close();
  if (!html || html.length < 500) throw new Error('La página no cargó. Verificá que estés logueado en Smartier.');
  const datos = parsearOrdenDesdeHTML(html);
  if (!datos.cliente && !datos.producto) throw new Error('No se encontraron datos. Verificá el número de orden.');
  return datos;
};

const generarHTMLRemito = (r) => `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Remito ${r.id}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#f5f5f5;color:#333}
.container{width:210mm;background:white;margin:20px auto;padding:40px;box-shadow:0 0 10px rgba(0,0,0,.1)}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a3a52;padding-bottom:20px;margin-bottom:30px}
.empresa-info h1{font-size:20px;font-weight:bold;color:#1a3a52;margin-bottom:5px}
.empresa-info p{font-size:12px;color:#666;margin:2px 0}
.remito-titulo{text-align:right}
.remito-numero{font-size:32px;font-weight:bold;color:#1a3a52}
.remito-label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px}
.two-columns{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px}
.campo{margin-bottom:12px}
.label{font-size:10px;font-weight:bold;color:#666;text-transform:uppercase;margin-bottom:3px}
.valor{font-size:14px;color:#333;font-weight:500}
.section-title{font-size:11px;font-weight:bold;text-transform:uppercase;color:#1a3a52;border-bottom:2px solid #ddd;padding-bottom:8px;margin-bottom:15px;letter-spacing:1px}
.productos{border:1px solid #ddd;border-radius:4px;overflow:hidden;margin-bottom:30px}
.tabla-header{background:#f9f9f9;border-bottom:2px solid #1a3a52;display:grid;grid-template-columns:2fr 1fr;padding:10px 12px;font-size:11px;font-weight:bold;color:#1a3a52;text-transform:uppercase}
.tabla-fila{display:grid;grid-template-columns:2fr 1fr;padding:14px 12px;font-size:13px}
.desc-bloque{background:#f9f9f9;border:1px solid #eee;border-radius:4px;padding:12px;font-size:12px;color:#555;white-space:pre-wrap;margin-bottom:30px}
.footer{margin-top:40px;padding-top:20px;border-top:2px solid #ddd;text-align:center}
.pie{margin-top:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;font-size:10px;text-align:center;color:#999}
@media print{body{background:white}.container{margin:0;box-shadow:none}*{-webkit-print-color-adjust:exact;color-adjust:exact}}
</style></head><body>
<div class="container">
  <div class="header">
    <div class="empresa-info">
      <h1>TALLERES GRÁFICOS DEL NORTE S.R.L.</h1>
      <p>CUIT: 30-70897696-9</p>
      <p>Perú 1011, 1602 - Florida (Buenos Aires)</p>
      <p>info@tgnorte.com.ar</p>
    </div>
    <div class="remito-titulo">
      <div class="remito-numero">Remito #${r.id}</div>
      <div class="remito-label">Nota de Entrega</div>
    </div>
  </div>
  <div class="two-columns">
    <div>
      <div class="campo"><div class="label">Orden Smartier</div><div class="valor">#${r.orden}</div></div>
      <div class="campo"><div class="label">Fecha de Remito</div><div class="valor">${r.fecha}</div></div>
      <div class="campo"><div class="label">Fecha Creación</div><div class="valor">${r.fechaCreacion}</div></div>
    </div>
    <div>
      <div class="campo"><div class="label">Cliente</div><div class="valor">${r.cliente}</div></div>
      <div class="campo"><div class="label">Contacto</div><div class="valor">${r.representante}</div></div>
      <div class="campo"><div class="label">Plazo / Entrega</div><div class="valor">${r.fechaEntrega}</div></div>
    </div>
  </div>
  <div class="section-title">Productos / Servicios</div>
  <div class="productos">
    <div class="tabla-header"><div>Descripción</div><div>Estado</div></div>
    <div class="tabla-fila"><div>${r.producto}</div><div>${r.estado}</div></div>
  </div>
  ${r.descripcion ? `<div class="section-title">Descripción de la Orden</div><div class="desc-bloque">${r.descripcion}</div>` : ''}
  ${r.direccion ? `<div class="campo"><div class="label">Dirección de Entrega</div><div class="valor">${r.direccion}</div></div>` : ''}
  <div class="footer">
    <p style="font-size:11px;color:#999;margin-bottom:30px;font-style:italic">Remito generado el ${new Date().toLocaleDateString('es-AR')} - Sistema TG Norte</p>
    <div class="pie">
      <div><p style="margin-bottom:30px">_______________</p>Entregado por</div>
      <div><p style="margin-bottom:30px">_______________</p>Recibido por</div>
      <div><p style="margin-bottom:30px">_______________</p>Autorizado por</div>
    </div>
  </div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;

export default function RemitosApp() {
  const [numeroOrden, setNumeroOrden] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datosOrden, setDatosOrden] = useState(null);
  const [remitos, setRemitos] = useState([]);
  const [numeroRemito, setNumeroRemito] = useState(1001);

  const handleScrapear = async () => {
    if (!numeroOrden.trim()) { setError('Ingresá un número de orden'); return; }
    setLoading(true); setError(null); setDatosOrden(null);
    try {
      const datos = await scrapearOrdenReal(numeroOrden.trim());
      setDatosOrden(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarRemito = () => {
    const nuevo = {
      id: numeroRemito,
      orden: datosOrden.numero || numeroOrden,
      cliente: datosOrden.cliente,
      representante: datosOrden.representante,
      fecha: new Date().toLocaleDateString('es-AR'),
      fechaCreacion: datosOrden.fechaCreacion,
      fechaEntrega: datosOrden.fechaEntrega,
      producto: datosOrden.producto,
      descripcion: datosOrden.descripcion,
      direccion: datosOrden.direccion,
      estado: datosOrden.estado,
    };
    setRemitos([nuevo, ...remitos]);
    setNumeroRemito(numeroRemito + 1);
    setDatosOrden(null);
    setNumeroOrden('');
  };

  const handleImprimir = (r) => {
    const v = window.open('', '', 'width=900,height=700');
    v.document.write(generarHTMLRemito(r));
    v.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Generador de Remitos</h1>
          </div>
          <p className="text-slate-400 text-sm">TALLERES GRÁFICOS DEL NORTE — Conectado a Smartier</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />Nueva Orden
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Número de Orden Smartier</label>
                  <input
                    type="text" value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrapear()}
                    placeholder="Ej: 36042"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
                  />
                </div>
                <button onClick={handleScrapear} disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Cargando orden...</> : <><Download className="w-5 h-5" />Cargar desde Smartier</>}
                </button>
                <p className="text-xs text-slate-400 text-center">Requiere estar logueado en Smartier en este navegador</p>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {datosOrden && (
                <div className="mt-5 bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />Orden Cargada
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div><p className="text-slate-500 text-xs uppercase font-semibold">Orden</p><p className="font-mono font-bold">#{datosOrden.numero || numeroOrden}</p></div>
                    <div><p className="text-slate-500 text-xs uppercase font-semibold">Cliente</p><p>{datosOrden.cliente}</p></div>
                    <div><p className="text-slate-500 text-xs uppercase font-semibold">Producto</p><p>{datosOrden.producto}</p></div>
                    <div><p className="text-slate-500 text-xs uppercase font-semibold">Estado</p><p>{datosOrden.estado}</p></div>
                    <div className="col-span-2"><p className="text-slate-500 text-xs uppercase font-semibold">Entrega</p><p>{datosOrden.fechaEntrega}</p></div>
                    {datosOrden.direccion && <div className="col-span-2"><p className="text-slate-500 text-xs uppercase font-semibold">Dirección</p><p>{datosOrden.direccion}</p></div>}
                  </div>
                  <button onClick={handleGenerarRemito}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                    ✓ Generar Remito #{numeroRemito}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">Remitos Generados</p>
                  <p className="text-4xl font-bold text-blue-600">{remitos.length}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">Próximo Remito</p>
                  <p className="text-2xl font-bold text-slate-900">#{numeroRemito}</p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-slate-500 text-xs uppercase font-semibold mb-2">Últimos</p>
                  <div className="space-y-2">
                    {remitos.slice(0, 5).map((r) => (
                      <div key={r.id} className="bg-slate-50 p-2 rounded flex justify-between items-center">
                        <span className="font-mono text-blue-600 font-bold text-sm">#{r.id}</span>
                        <span className="text-slate-600 text-xs truncate ml-2">{r.cliente}</span>
                      </div>
                    ))}
                    {remitos.length === 0 && <p className="text-slate-400 italic text-xs">Sin remitos aún</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {remitos.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Remitos Generados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Remito','Orden','Cliente','Producto','Fecha','Acción'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {remitos.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-blue-600">#{r.id}</td>
                      <td className="px-5 py-4 text-sm">#{r.orden}</td>
                      <td className="px-5 py-4 text-sm">{r.cliente}</td>
                      <td className="px-5 py-4 text-sm text-slate-600 max-w-xs truncate">{r.producto}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{r.fecha}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleImprimir(r)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition">
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
}
