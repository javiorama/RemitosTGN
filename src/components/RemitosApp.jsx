import React, { useState, useEffect } from 'react';
import { FileText, Printer, Plus, AlertCircle, CheckCircle2, BookmarkIcon, Loader2, Trash2 } from 'lucide-react';

const BACKEND_URL = 'https://backend-arca-production.up.railway.app';
const STORAGE_KEY = 'remitos_tgn';
const STORAGE_NUMERO_KEY = 'remitos_tgn_numero';

const cargarRemitos = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const cargarNumero = () => {
  try { return parseInt(localStorage.getItem(STORAGE_NUMERO_KEY) || '1001'); }
  catch { return 1001; }
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
.cai-box{margin-top:8px;background:#f0f7ff;border:1px solid #1a3a52;border-radius:4px;padding:6px 10px;text-align:right}
.cai-label{font-size:9px;color:#666;text-transform:uppercase;letter-spacing:1px}
.cai-value{font-size:12px;font-weight:bold;color:#1a3a52;font-family:monospace}
.cai-vto{font-size:10px;color:#888}
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
      ${r.cae ? `
      <div class="cai-box">
        <div class="cai-label">CAI</div>
        <div class="cai-value">${r.cae}</div>
        <div class="cai-vto">Vto: ${r.caeFechaVto || ''}</div>
      </div>` : ''}
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
    <p style="font-size:11px;color:#999;margin-bottom:30px;font-style:italic">Remito generado el ${r.fecha} - Sistema TG Norte</p>
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
  const [remitos, setRemitos] = useState(cargarRemitos);
  const [numeroRemito, setNumeroRemito] = useState(cargarNumero);
  const [ordenCargada, setOrdenCargada] = useState(null);
  const [tab, setTab] = useState('nuevo');
  const [generando, setGenerando] = useState(false);
  const [backendStatus, setBackendStatus] = useState('sin-cert'); // null | 'ok' | 'sin-cert' | 'error'
  const [busqueda, setBusqueda] = useState('');

  // Persistir remitos en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remitos));
  }, [remitos]);

  // Persistir número de remito
  useEffect(() => {
    localStorage.setItem(STORAGE_NUMERO_KEY, numeroRemito.toString());
  }, [numeroRemito]);

  // Verificar estado del backend al cargar
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(r => r.json())
      .then(data => {
        setBackendStatus(data.certificado === 'configurado' ? 'ok' : 'sin-cert');
      })
      .catch(() => setBackendStatus('error'));
  }, []);

  // Leer datos desde URL (bookmarklet)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('producto') || params.get('cliente')) {
      setOrdenCargada({
        numero:        params.get('orden') || '',
        cliente:       params.get('cliente') || '',
        representante: params.get('representante') || '',
        producto:      params.get('producto') || '',
        descripcion:   params.get('descripcion') || '',
        fechaCreacion: params.get('fechaCreacion') || '',
        fechaEntrega:  params.get('fechaEntrega') || '',
        direccion:     params.get('direccion') || '',
        estado:        params.get('estado') || '',
      });
      setTab('nuevo');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleGenerarRemito = async () => {
    setGenerando(true);
    let cae = null;
    let caeFechaVto = null;

    // Intentar obtener CAI del backend si está configurado
    if (backendStatus === 'ok') {
      try {
        const res = await fetch(`${BACKEND_URL}/generar-remito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: ordenCargada.cliente,
            orden: ordenCargada.numero,
            producto: ordenCargada.producto,
          })
        });
        const data = await res.json();
        if (data.success) {
          cae = data.cae;
          caeFechaVto = data.caeFechaVto;
        }
      } catch (e) {
        console.error('Error obteniendo CAI:', e);
      }
    }

    const nuevo = {
      id: numeroRemito,
      orden: ordenCargada.numero,
      cliente: ordenCargada.cliente,
      representante: ordenCargada.representante,
      fecha: new Date().toLocaleDateString('es-AR'),
      fechaCreacion: ordenCargada.fechaCreacion,
      fechaEntrega: ordenCargada.fechaEntrega,
      producto: ordenCargada.producto,
      descripcion: ordenCargada.descripcion,
      direccion: ordenCargada.direccion,
      estado: ordenCargada.estado,
      cae,
      caeFechaVto,
    };

    setRemitos(prev => [nuevo, ...prev]);
    setNumeroRemito(prev => prev + 1);
    setOrdenCargada(null);
    setGenerando(false);
  };

  const handleImprimir = (r) => {
    const v = window.open('', '', 'width=900,height=700');
    v.document.write(generarHTMLRemito(r));
    v.document.close();
  };

  const handleEliminar = (id) => {
    if (confirm(`¿Eliminár el remito #${id}? Esta acción no se puede deshacer.`)) {
      setRemitos(prev => prev.filter(r => r.id !== id));
    }
  };

  const remitosFiltrados = remitos.filter(r =>
    !busqueda ||
    r.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.orden?.toString().includes(busqueda) ||
    r.id?.toString().includes(busqueda)
  );

  const badgeBackend = () => {
    if (backendStatus === 'ok') return <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">CAI ✓</span>;
    if (backendStatus === 'sin-cert') return <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded-full">Sin certificado</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FileText className="w-7 h-7 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Generador de Remitos</h1>
              {badgeBackend()}
            </div>
            <p className="text-slate-400 text-sm">TALLERES GRÁFICOS DEL NORTE — Conectado a Smartier</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab('nuevo')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'nuevo' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              Nuevo Remito
            </button>
            <button onClick={() => setTab('historial')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'historial' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              Historial ({remitos.length})
            </button>
            <button onClick={() => setTab('instrucciones')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'instrucciones' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              Bookmarklet
            </button>
          </div>
        </div>

        {tab === 'instrucciones' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-blue-600" />
              Cómo configurar el Bookmarklet
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              Click derecho en tu barra de favoritos → "Añadir página" → Nombre: <strong>Generar Remito TGN</strong> → pegá este código como URL:
            </p>
            <textarea
              readOnly
              value={`javascript:(function(){var t=function(s){var e=document.querySelector(s);return e?e.textContent.trim():""};var numero=window.location.hash.match(/Ordenes\\/(\d+)/)?.[1]||"";var cliente=t(".nombre-cliente.ng-binding");var rep=t(".nombre-representante.ng-binding");var prod=t(".nombre-producto.ng-binding");var ref=t(".referencia.ng-binding");var producto=ref?prod+" - "+ref:prod;var desc="";var descEl=document.querySelector(".st-card-content.ng-binding");if(descEl)desc=(descEl.innerText||descEl.textContent).trim().slice(0,400);var fechaEls=document.querySelectorAll(".fecha-value.ng-binding");var fc=fechaEls[0]?fechaEls[0].textContent.trim():"";var fe=fechaEls[1]?fechaEls[1].textContent.trim():"";var dir=t(".comentarios .ng-binding");var estado=t(".st-chip.estado-1");window.location.href="https://remitos-tgn.vercel.app?orden="+encodeURIComponent(numero)+"&cliente="+encodeURIComponent(cliente)+"&representante="+encodeURIComponent(rep)+"&producto="+encodeURIComponent(producto)+"&descripcion="+encodeURIComponent(desc)+"&fechaCreacion="+encodeURIComponent(fc)+"&fechaEntrega="+encodeURIComponent(fe)+"&direccion="+encodeURIComponent(dir)+"&estado="+encodeURIComponent(estado);})();`}
              className="w-full text-xs font-mono bg-slate-900 text-green-400 p-3 rounded border border-slate-700 h-28 resize-none"
              onClick={(e) => e.target.select()}
            />
            <p className="text-xs text-slate-400 mt-2">Click en el texto para seleccionar todo → Ctrl+C para copiar</p>
          </div>
        )}

        {tab === 'nuevo' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />Nuevo Remito
                </h2>

                {!ordenCargada && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookmarkIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold mb-2">Esperando datos de Smartier</p>
                    <p className="text-slate-400 text-sm mb-4">
                      Abrí una orden en Smartier y clickeá el bookmark <strong>"Generar Remito TGN"</strong>
                    </p>
                    <button onClick={() => setTab('instrucciones')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold underline">
                      Ver cómo configurar el bookmarklet →
                    </button>
                  </div>
                )}

                {ordenCargada && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Orden Cargada desde Smartier
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Orden</p><p className="font-mono font-bold">#{ordenCargada.numero}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Cliente</p><p>{ordenCargada.cliente}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Producto</p><p>{ordenCargada.producto}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Estado</p><p>{ordenCargada.estado}</p></div>
                      <div className="col-span-2"><p className="text-slate-500 text-xs uppercase font-semibold">Entrega</p><p>{ordenCargada.fechaEntrega}</p></div>
                      {ordenCargada.direccion && <div className="col-span-2"><p className="text-slate-500 text-xs uppercase font-semibold">Dirección</p><p>{ordenCargada.direccion}</p></div>}
                    </div>
                    {backendStatus === 'ok' && (
                      <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        El remito se generará con CAI oficial de ARCA
                      </div>
                    )}
                    {backendStatus === 'sin-cert' && (
                      <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        Se generará sin CAI (certificado ARCA pendiente)
                      </div>
                    )}
                    <button onClick={handleGenerarRemito} disabled={generando}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                      {generando ? <><Loader2 className="w-5 h-5 animate-spin" />Generando...</> : `✓ Generar Remito #${numeroRemito}`}
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
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-semibold">Con CAI</p>
                    <p className="text-2xl font-bold text-green-600">{remitos.filter(r => r.cae).length}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-slate-500 text-xs uppercase font-semibold mb-2">Últimos</p>
                    <div className="space-y-2">
                      {remitos.slice(0, 5).map((r) => (
                        <div key={r.id} className="bg-slate-50 p-2 rounded flex justify-between items-center">
                          <span className="font-mono text-blue-600 font-bold text-sm">#{r.id}</span>
                          <span className="text-slate-600 text-xs truncate ml-2">{r.cliente}</span>
                          {r.cae && <span className="text-green-500 text-xs ml-1">CAI</span>}
                        </div>
                      ))}
                      {remitos.length === 0 && <p className="text-slate-400 italic text-xs">Sin remitos aún</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'historial' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">Historial de Remitos</h2>
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por cliente, orden o número..."
                className="flex-1 max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {remitosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                {busqueda ? 'No se encontraron remitos con ese criterio.' : 'No hay remitos generados aún.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Remito','Orden','Cliente','Producto','Fecha','CAI','Acciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {remitosFiltrados.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">#{r.id}</td>
                        <td className="px-4 py-3 text-sm">#{r.orden}</td>
                        <td className="px-4 py-3 text-sm">{r.cliente}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{r.producto}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.fecha}</td>
                        <td className="px-4 py-3 text-sm">
                          {r.cae
                            ? <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">✓ CAI</span>
                            : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleImprimir(r)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition flex items-center gap-1">
                              <Printer className="w-3 h-3" />Imprimir
                            </button>
                            <button onClick={() => handleEliminar(r.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1 px-2 rounded text-sm transition">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
