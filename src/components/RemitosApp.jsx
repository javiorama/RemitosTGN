import React, { useState, useEffect } from 'react';
import { FileText, Printer, Plus, AlertCircle, CheckCircle2, BookmarkIcon, Loader2, Trash2 } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { RemitoPDF, fmtNumero } from './RemitoPDF';

const BACKEND_URL = 'https://backend-arca-production.up.railway.app';
const STORAGE_KEY = 'remitos_tgn';
const STORAGE_NUMERO_KEY = 'remitos_tgn_numero';

const cargarRemitos = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const cargarNumero = () => {
  try { return parseInt(localStorage.getItem(STORAGE_NUMERO_KEY) || '1'); }
  catch { return 1; }
};

export default function RemitosApp() {
  const [remitos, setRemitos] = useState(cargarRemitos);
  const [numeroRemito, setNumeroRemito] = useState(cargarNumero);
  const [ordenCargada, setOrdenCargada] = useState(null);
  const [tab, setTab] = useState('nuevo');
  const [generando, setGenerando] = useState(false);
  const [backendStatus, setBackendStatus] = useState('sin-cert');
  const [busqueda, setBusqueda] = useState('');
  const [previsualizando, setPrevisualizando] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(remitos)); }, [remitos]);
  useEffect(() => { localStorage.setItem(STORAGE_NUMERO_KEY, numeroRemito.toString()); }, [numeroRemito]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(r => r.json())
      .then(data => setBackendStatus(data.certificado === 'configurado' ? 'ok' : 'sin-cert'))
      .catch(() => setBackendStatus('sin-cert'));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('producto') || params.get('cliente')) {
      setOrdenCargada({
        numero: params.get('orden') || '',
        cliente: params.get('cliente') || '',
        representante: params.get('representante') || '',
        producto: params.get('producto') || '',
        descripcion: params.get('descripcion') || '',
        fechaCreacion: params.get('fechaCreacion') || '',
        fechaEntrega: params.get('fechaEntrega') || '',
        direccion: params.get('direccion') || '',
        estado: params.get('estado') || '',
      });
      setTab('nuevo');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleGenerarRemito = async () => {
    setGenerando(true);
    let cae = null, caeFechaVto = null;
    if (backendStatus === 'ok') {
      try {
        const res = await fetch(`${BACKEND_URL}/generar-remito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cliente: ordenCargada.cliente, orden: ordenCargada.numero, producto: ordenCargada.producto })
        });
        const data = await res.json();
        if (data.success) { cae = data.cae; caeFechaVto = data.caeFechaVto; }
      } catch (e) { console.error('Error CAI:', e); }
    }
    const nuevo = {
      id: numeroRemito, orden: ordenCargada.numero, cliente: ordenCargada.cliente,
      representante: ordenCargada.representante, fecha: new Date().toLocaleDateString('es-AR'),
      fechaCreacion: ordenCargada.fechaCreacion, fechaEntrega: ordenCargada.fechaEntrega,
      producto: ordenCargada.producto, descripcion: ordenCargada.descripcion,
      direccion: ordenCargada.direccion, estado: ordenCargada.estado, cae, caeFechaVto,
    };
    setRemitos(prev => [nuevo, ...prev]);
    setNumeroRemito(prev => prev + 1);
    setOrdenCargada(null);
    setGenerando(false);
  };

  const handleEliminar = (id) => {
    if (confirm(`¿Eliminar el remito ${fmtNumero(id)}?`)) {
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
    return <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded-full">Sin certificado</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Modal previsualización */}
        {previsualizando && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ height: '90vh' }}>
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Remito {fmtNumero(previsualizando.id)}</h3>
                <div className="flex gap-3">
                  <PDFDownloadLink
                    document={<RemitoPDF r={previsualizando} />}
                    fileName={`Remito_${fmtNumero(previsualizando.id)}.pdf`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2"
                  >
                    {({ loading }) => loading ? 'Generando...' : '⬇ Descargar PDF'}
                  </PDFDownloadLink>
                  <button onClick={() => setPrevisualizando(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm">
                    Cerrar
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <RemitoPDF r={previsualizando} />
                </PDFViewer>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FileText className="w-7 h-7 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Generador de Remitos</h1>
              {badgeBackend()}
            </div>
            <p className="text-slate-400 text-sm">TALLERES GRÁFICOS DEL NORTE — Conectado a Smartier</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTab('nuevo')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab==='nuevo'?'bg-blue-600 text-white':'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Nuevo Remito</button>
            <button onClick={() => setTab('historial')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab==='historial'?'bg-blue-600 text-white':'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Historial ({remitos.length})</button>
            <button onClick={() => setTab('instrucciones')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab==='instrucciones'?'bg-blue-600 text-white':'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Bookmarklet</button>
          </div>
        </div>

        {tab === 'instrucciones' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-blue-600" />Configurar Bookmarklet
            </h2>
            <p className="text-slate-600 text-sm mb-4">Click derecho en la barra de favoritos → "Añadir página" → Nombre: <strong>Generar Remito TGN</strong> → pegá esto como URL:</p>
            <textarea readOnly
              value={`javascript:(function(){var t=function(s){var e=document.querySelector(s);return e?e.textContent.trim():""};var numero=window.location.hash.match(/Ordenes\\/(\\d+)/)?.[1]||"";var cliente=t(".nombre-cliente.ng-binding");var rep=t(".nombre-representante.ng-binding");var prod=t(".nombre-producto.ng-binding");var ref=t(".referencia.ng-binding");var producto=ref?prod+" - "+ref:prod;var desc="";var descEl=document.querySelector(".st-card-content.ng-binding");if(descEl)desc=(descEl.innerText||descEl.textContent).trim().slice(0,400);var fechaEls=document.querySelectorAll(".fecha-value.ng-binding");var fc=fechaEls[0]?fechaEls[0].textContent.trim():"";var fe=fechaEls[1]?fechaEls[1].textContent.trim():"";var dir=t(".comentarios .ng-binding");var estado=t(".st-chip.estado-1");window.location.href="https://remitos-tgn.vercel.app?orden="+encodeURIComponent(numero)+"&cliente="+encodeURIComponent(cliente)+"&representante="+encodeURIComponent(rep)+"&producto="+encodeURIComponent(producto)+"&descripcion="+encodeURIComponent(desc)+"&fechaCreacion="+encodeURIComponent(fc)+"&fechaEntrega="+encodeURIComponent(fe)+"&direccion="+encodeURIComponent(dir)+"&estado="+encodeURIComponent(estado);})();`}
              className="w-full text-xs font-mono bg-slate-900 text-green-400 p-3 rounded border border-slate-700 h-24 resize-none"
              onClick={(e) => e.target.select()}
            />
            <p className="text-xs text-slate-400 mt-2">Click en el texto → Ctrl+C para copiar</p>
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
                    <p className="text-slate-400 text-sm mb-4">Abrí una orden en Smartier y clickeá el bookmark <strong>"Generar Remito TGN"</strong></p>
                    <button onClick={() => setTab('instrucciones')} className="text-blue-600 hover:text-blue-700 text-sm font-semibold underline">Ver cómo configurar el bookmarklet →</button>
                  </div>
                )}
                {ordenCargada && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />Orden Cargada desde Smartier
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Orden</p><p className="font-mono font-bold">#{ordenCargada.numero}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Cliente</p><p>{ordenCargada.cliente}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Producto</p><p>{ordenCargada.producto}</p></div>
                      <div><p className="text-slate-500 text-xs uppercase font-semibold">Estado</p><p>{ordenCargada.estado}</p></div>
                      <div className="col-span-2"><p className="text-slate-500 text-xs uppercase font-semibold">Entrega</p><p>{ordenCargada.fechaEntrega}</p></div>
                    </div>
                    {backendStatus === 'sin-cert' && (
                      <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />Se generará sin CAI (certificado ARCA pendiente)
                      </div>
                    )}
                    <button onClick={handleGenerarRemito} disabled={generando}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                      {generando ? <><Loader2 className="w-5 h-5 animate-spin" />Generando...</> : `✓ Generar Remito ${fmtNumero(numeroRemito)}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Estadísticas</h3>
                <div className="space-y-4">
                  <div><p className="text-slate-500 text-xs uppercase font-semibold">Remitos Generados</p><p className="text-4xl font-bold text-blue-600">{remitos.length}</p></div>
                  <div><p className="text-slate-500 text-xs uppercase font-semibold">Próximo Remito</p><p className="text-lg font-bold text-slate-900 font-mono">{fmtNumero(numeroRemito)}</p></div>
                  <div><p className="text-slate-500 text-xs uppercase font-semibold">Con CAI</p><p className="text-2xl font-bold text-green-600">{remitos.filter(r => r.cae).length}</p></div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-slate-500 text-xs uppercase font-semibold mb-2">Últimos</p>
                    <div className="space-y-2">
                      {remitos.slice(0,5).map((r) => (
                        <div key={r.id} className="bg-slate-50 p-2 rounded flex justify-between items-center">
                          <span className="font-mono text-blue-600 font-bold text-xs">{fmtNumero(r.id)}</span>
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
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">Historial de Remitos</h2>
              <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por cliente, orden o número..."
                className="flex-1 min-w-0 max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {remitosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                {busqueda ? 'No se encontraron remitos.' : 'No hay remitos generados aún.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>{['Remito','Orden','Cliente','Producto','Fecha','CAI','Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {remitosFiltrados.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600 text-xs">{fmtNumero(r.id)}</td>
                        <td className="px-4 py-3 text-sm">#{r.orden}</td>
                        <td className="px-4 py-3 text-sm font-medium">{r.cliente}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{r.producto}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.fecha}</td>
                        <td className="px-4 py-3">
                          {r.cae ? <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">✓ CAI</span>
                            : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setPrevisualizando(r)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition flex items-center gap-1">
                              <Printer className="w-3 h-3" />Ver PDF
                            </button>
                            <button onClick={() => handleEliminar(r.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1 px-2 rounded text-sm transition">
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
