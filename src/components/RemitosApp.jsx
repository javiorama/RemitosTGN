import React, { useState, useEffect } from 'react';
import { FileText, Printer, Plus, AlertCircle, CheckCircle2, BookmarkIcon, Loader2, Trash2 } from 'lucide-react';

const BACKEND_URL = 'https://backend-arca-production.up.railway.app';
const STORAGE_KEY = 'remitos_tgn';
const STORAGE_NUMERO_KEY = 'remitos_tgn_numero';
const PUNTO_VENTA = '00001';
const LOGO = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAMPBp8DASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAYHBQgDBAkBAv/EAEMQAQABAwICBgcFBQYFBQAAAAABAgMEBREGBxIhMUFRYQgTInGBkaEUMkJysRUjUmLBJDOCkqLRCUNTk8IWc7LD0v/EABwBAQACAwEBAQAAAAAAAAAAAAAFBwMEBgECCP/EADcRAQABAwEECAUCBQUBAAAAAAABAgMEBQYRIVESMUFhcZGhsRNCgcHRIvAHFCNS4RUyM4KSwv/aAAwDAQACEQMRAD8A0yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z';

const cargarRemitos = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const cargarNumero = () => {
  try { return parseInt(localStorage.getItem(STORAGE_NUMERO_KEY) || '1'); }
  catch { return 1; }
};
export const fmtNumero = (n) => `${PUNTO_VENTA}-${String(n).padStart(8,'0')}`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; background: #e5e7eb; }

  .remito-wrap { width: 794px; margin: 24px auto; background: white; box-shadow: 0 4px 24px rgba(0,0,0,.15); }

  /* HEADER */
  .header { display: flex; border-bottom: 2px solid #1a3a52; }
  .header-logo { width: 200px; padding: 16px 18px; border-right: 1.5px solid #e0e0e0; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
  .logo-img { width: 120px; }
  .razon-social { font-size: 8px; font-weight: 700; color: #1a3a52; text-transform: uppercase; letter-spacing: .5px; line-height: 1.4; }
  .header-datos { flex: 1; padding: 14px 16px; border-right: 1.5px solid #e0e0e0; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
  .header-datos p { font-size: 10px; color: #444; line-height: 1.6; }
  .header-datos .iva { font-size: 9px; color: #888; margin-top: 4px; font-style: italic; }
  .header-comp { width: 180px; padding: 12px 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
  .cod-afip { font-size: 9px; color: #888; }
  .r-wrap { display: flex; align-items: center; gap: 10px; }
  .r-circle { width: 46px; height: 46px; border-radius: 50%; border: 2.5px solid #1a3a52; display: flex; align-items: center; justify-content: center; }
  .r-letter { font-size: 24px; font-weight: 800; color: #1a3a52; line-height: 1; }
  .remito-lbl { font-size: 20px; font-weight: 800; color: #1a3a52; letter-spacing: 3px; }
  .cuit-blk { font-size: 8.5px; text-align: center; color: #444; line-height: 1.7; }

  /* NÚMERO Y FECHA */
  .nro-fecha { display: flex; align-items: stretch; border-bottom: 1.5px solid #1a3a52; background: #f8fafc; }
  .nro-box { flex: 1; padding: 6px 14px; display: flex; align-items: center; }
  .nro-text { font-size: 13px; font-weight: 700; color: #1a3a52; letter-spacing: .5px; }
  .fecha-grid { display: flex; border-left: 1.5px solid #1a3a52; }
  .fecha-cel { width: 54px; padding: 4px 6px; text-align: center; border-right: 1px solid #ddd; }
  .fecha-cel:last-child { border-right: none; width: 64px; }
  .fecha-lbl { font-size: 8px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: .5px; }
  .fecha-val { font-size: 16px; font-weight: 800; color: #1a3a52; }

  /* CAMPOS DEL CLIENTE */
  .fields { padding: 10px 14px 8px; border-bottom: 1.5px solid #e0e0e0; display: flex; flex-direction: column; gap: 7px; }
  .frow { display: flex; gap: 12px; }
  .field { display: flex; align-items: flex-end; flex: 1; gap: 4px; padding-bottom: 2px; border-bottom: 1px solid #ccc; }
  .fl { font-size: 9px; font-weight: 600; color: #666; white-space: nowrap; padding-bottom: 2px; }
  .fv { flex: 1; font-size: 10.5px; color: #222; font-weight: 500; padding-bottom: 2px; min-height: 16px; }
  .fv.sim { color: #94a3b8; font-style: italic; }

  /* ITEMS */
  .items-title { background: #1a3a52; color: white; padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
  .items-area { padding: 12px 14px; min-height: 220px; border-bottom: 1.5px solid #e0e0e0; font-size: 10.5px; line-height: 1.8; color: #222; white-space: pre-wrap; }

  /* ENTREGA */
  .entrega-bar { background: #f8fafc; border-bottom: 1.5px solid #e0e0e0; padding: 6px 14px; display: flex; gap: 16px; }
  .entrega-field { display: flex; align-items: flex-end; flex: 1; gap: 4px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }

  /* FIRMAS */
  .firmas { display: flex; border-bottom: 1.5px solid #e0e0e0; padding: 16px 20px 10px; gap: 20px; }
  .firma-box { flex: 1; text-align: center; }
  .firma-linea { border-bottom: 1px solid #555; height: 32px; margin-bottom: 5px; }
  .firma-lbl { font-size: 9px; color: #555; }

  /* CAI */
  .cai-bar { display: flex; justify-content: space-between; align-items: center; padding: 7px 14px; border-bottom: 1px solid #e0e0e0; background: #f8fafc; }
  .barcode-area { display: flex; flex-direction: column; gap: 2px; }
  .barcode-box { border: 1px dashed #ccc; background: white; width: 180px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 2px; }
  .barcode-txt { font-size: 8px; color: #bbb; }
  .barcode-num { font-size: 7.5px; color: #aaa; font-family: monospace; }
  .cai-datos { text-align: right; }
  .cai-val { font-size: 11px; font-weight: 700; color: #1a3a52; font-family: monospace; }
  .cai-vto { font-size: 10px; color: #444; }
  .cai-pending { font-size: 9px; color: #bbb; }

  /* PIE */
  .pie { padding: 5px 14px; font-size: 8px; color: #aaa; background: #f8fafc; text-align: center; }

  @media print {
    body { background: white; }
    .remito-wrap { margin: 0; box-shadow: none; width: 100%; }
    * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
  }
`;

const RemitoDoc = ({ r }) => {
  const [dia, mes, anio] = r.fecha.split('/');
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <title>Remito {fmtNumero(r.id)}</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <div className="remito-wrap">

          {/* HEADER */}
          <div className="header">
            <div className="header-logo">
              <img className="logo-img" src={LOGO} alt="TGN" />
              <div className="razon-social">Talleres Gráficos del Norte S.R.L.</div>
            </div>
            <div className="header-datos">
              <p>Perú 1011 . Florida &nbsp;·&nbsp; B1602EIC, Bs. As.</p>
              <p>Tel: 4513-1430 (Líneas Rot.)</p>
              <p>E-mail: info@tgnorte.com.ar</p>
              <p className="iva">IVA Responsable Inscripto</p>
            </div>
            <div className="header-comp">
              <div className="cod-afip">Código Nº 91</div>
              <div className="r-wrap">
                <div className="r-circle"><span className="r-letter">R</span></div>
                <span className="remito-lbl">REMITO</span>
              </div>
              <div className="cuit-blk">
                <div>C.U.I.T. 30-70897696-9</div>
                <div>Ing. Brutos C.M.:902-826033-8</div>
                <div>Inic. de Act. 01/12/04</div>
              </div>
            </div>
          </div>

          {/* NRO Y FECHA */}
          <div className="nro-fecha">
            <div className="nro-box">
              <span className="nro-text">N° {fmtNumero(r.id)}</span>
            </div>
            <div className="fecha-grid">
              <div className="fecha-cel"><div className="fecha-lbl">Día</div><div className="fecha-val">{dia}</div></div>
              <div className="fecha-cel"><div className="fecha-lbl">Mes</div><div className="fecha-val">{mes}</div></div>
              <div className="fecha-cel"><div className="fecha-lbl">Año</div><div className="fecha-val">{anio}</div></div>
            </div>
          </div>

          {/* CAMPOS CLIENTE */}
          <div className="fields">
            <div className="frow">
              <div className="field" style={{flex:2}}><span className="fl">Señor (es):</span><span className="fv">{r.cliente}</span></div>
              <div className="field"><span className="fl">I.V.A.:</span><span className="fv sim">Resp. Inscripto</span></div>
            </div>
            <div className="frow">
              <div className="field"><span className="fl">Cliente Nro.:</span><span className="fv sim">—</span></div>
              <div className="field"><span className="fl">C.U.I.T.:</span><span className="fv sim">a completar</span></div>
            </div>
            <div className="frow">
              <div className="field" style={{flex:2}}><span className="fl">Domicilio:</span><span className="fv sim">a completar</span></div>
              <div className="field"><span className="fl">Tel.:</span><span className="fv sim">—</span></div>
            </div>
            <div className="frow">
              <div className="field"><span className="fl">Cond. Venta:</span><span className="fv sim">Cta. Corriente</span></div>
              <div className="field"><span className="fl">Localidad:</span><span className="fv sim">—</span></div>
              <div className="field"><span className="fl">Factura Nro.:</span><span className="fv sim">—</span></div>
              <div className="field"><span className="fl">Pedido Nro.:</span><span className="fv">#{r.orden}</span></div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="items-title">Remitimos a Ud/s. lo siguiente</div>
          <div className="items-area">{r.descripcion || r.producto}</div>

          {/* FIRMAS */}
          <div className="firmas">
            <div className="firma-box"><div className="firma-linea"></div><div className="firma-lbl">Aclaración y DNI</div></div>
            <div className="firma-box"><div className="firma-linea"></div><div className="firma-lbl">Firma</div></div>
            <div className="firma-box"><div className="firma-linea"></div><div className="firma-lbl">Aclaración TGN</div></div>
          </div>

          {/* CAI */}
          <div className="cai-bar">
            <div className="barcode-area">
              <div className="barcode-box">
                <span className="barcode-txt">{r.cae ? r.cae : 'Código de barras — requiere certificado ARCA'}</span>
              </div>
              <span className="barcode-num">30708976969{PUNTO_VENTA}{r.cae || '00000000000000'}</span>
            </div>
            <div className="cai-datos">
              {r.cae ? (
                <>
                  <div className="cai-val">C.A.I. Nº: {r.cae}</div>
                  <div className="cai-vto">Fecha Vto.: {r.caeFechaVto || ''}</div>
                </>
              ) : (
                <div className="cai-pending">C.A.I. pendiente — certificado ARCA</div>
              )}
            </div>
          </div>

          {/* PIE */}
          <div className="pie">
            Sistema de Remitos Digitales · Talleres Gráficos del Norte S.R.L. · CUIT 30-70897696-9 · Generado el {r.fecha}
          </div>

        </div>
        <script dangerouslySetInnerHTML={{ __html: 'window.onload=()=>window.print()' }} />
      </body>
    </html>
  );
};

const remitoToHTML = (r) => {
  const el = document.createElement('div');
  const root = window.__reactRemitoRoot || (window.__reactRemitoRoot = null);
  // Usamos renderToStaticMarkup-like approach: ventana nueva con React renderizado
  return null;
};

export default function RemitosApp() {
  const [remitos, setRemitos] = useState(cargarRemitos);
  const [numeroRemito, setNumeroRemito] = useState(cargarNumero);
  const [ordenCargada, setOrdenCargada] = useState(null);
  const [tab, setTab] = useState('nuevo');
  const [generando, setGenerando] = useState(false);
  const [backendStatus, setBackendStatus] = useState('sin-cert');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(remitos)); }, [remitos]);
  useEffect(() => { localStorage.setItem(STORAGE_NUMERO_KEY, numeroRemito.toString()); }, [numeroRemito]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(res => res.json())
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

  const handleImprimir = (r) => {
    const v = window.open('', '_blank', 'width=900,height=750');
    // Inyectar React en la ventana nueva y renderizar
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Remito ${fmtNumero(r.id)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>
<div class="remito-wrap">
  <div class="header">
    <div class="header-logo">
      <img class="logo-img" src="${LOGO}" alt="TGN"/>
      <div class="razon-social">Talleres Gráficos del Norte S.R.L.</div>
    </div>
    <div class="header-datos">
      <p>Perú 1011 . Florida &nbsp;·&nbsp; B1602EIC, Bs. As.</p>
      <p>Tel: 4513-1430 (Líneas Rot.)</p>
      <p>E-mail: info@tgnorte.com.ar</p>
      <p class="iva">IVA Responsable Inscripto</p>
    </div>
    <div class="header-comp">
      <div class="cod-afip">Código Nº 91</div>
      <div class="r-wrap">
        <div class="r-circle"><span class="r-letter">R</span></div>
        <span class="remito-lbl">REMITO</span>
      </div>
      <div class="cuit-blk">
        <div>C.U.I.T. 30-70897696-9</div>
        <div>Ing. Brutos C.M.:902-826033-8</div>
        <div>Inic. de Act. 01/12/04</div>
      </div>
    </div>
  </div>

  <div class="nro-fecha">
    <div class="nro-box"><span class="nro-text">N° ${fmtNumero(r.id)}</span></div>
    <div class="fecha-grid">
      <div class="fecha-cel"><div class="fecha-lbl">Día</div><div class="fecha-val">${r.fecha.split('/')[0]}</div></div>
      <div class="fecha-cel"><div class="fecha-lbl">Mes</div><div class="fecha-val">${r.fecha.split('/')[1]}</div></div>
      <div class="fecha-cel"><div class="fecha-lbl">Año</div><div class="fecha-val">${r.fecha.split('/')[2]}</div></div>
    </div>
  </div>

  <div class="fields">
    <div class="frow">
      <div class="field" style="flex:2"><span class="fl">Señor (es):</span><span class="fv">${r.cliente}</span></div>
      <div class="field"><span class="fl">I.V.A.:</span><span class="fv sim">Resp. Inscripto</span></div>
    </div>
    <div class="frow">
      <div class="field"><span class="fl">Cliente Nro.:</span><span class="fv sim">—</span></div>
      <div class="field"><span class="fl">C.U.I.T.:</span><span class="fv sim">a completar</span></div>
    </div>
    <div class="frow">
      <div class="field" style="flex:2"><span class="fl">Domicilio:</span><span class="fv sim">a completar</span></div>
      <div class="field"><span class="fl">Tel.:</span><span class="fv sim">—</span></div>
    </div>
    <div class="frow">
      <div class="field"><span class="fl">Cond. Venta:</span><span class="fv sim">Cta. Corriente</span></div>
      <div class="field"><span class="fl">Localidad:</span><span class="fv sim">—</span></div>
      <div class="field"><span class="fl">Factura Nro.:</span><span class="fv sim">—</span></div>
      <div class="field"><span class="fl">Pedido Nro.:</span><span class="fv">#${r.orden}</span></div>
    </div>
  </div>

  <div class="items-title">Remitimos a Ud/s. lo siguiente</div>
  <div class="items-area">${(r.descripcion || r.producto).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>

  <div class="firmas">
    <div class="firma-box"><div class="firma-linea"></div><div class="firma-lbl">Aclaración y DNI</div></div>
    <div class="firma-box"><div class="firma-linea"></div><div class="firma-lbl">Firma</div></div>
    <div class="firma-box"><div class="firma-linea"></div><div class="firma-lbl">Aclaración TGN</div></div>
  </div>

  <div class="cai-bar">
    <div class="barcode-area">
      <div class="barcode-box">
        <span class="barcode-txt">${r.cae ? r.cae : 'Código de barras — requiere certificado ARCA'}</span>
      </div>
      <span class="barcode-num">30708976969${PUNTO_VENTA}${r.cae || '00000000000000'}</span>
    </div>
    <div class="cai-datos">
      ${r.cae
        ? `<div class="cai-val">C.A.I. Nº: ${r.cae}</div><div class="cai-vto">Fecha Vto.: ${r.caeFechaVto||''}</div>`
        : `<div class="cai-pending">C.A.I. pendiente — certificado ARCA</div>`}
    </div>
  </div>

  <div class="pie">
    Sistema de Remitos Digitales · Talleres Gráficos del Norte S.R.L. · CUIT 30-70897696-9 · Generado el ${r.fecha}
  </div>
</div>
<script>
  window.addEventListener('load', () => {
    setTimeout(() => window.print(), 800);
  });
</script>
</body>
</html>`;
    v.document.write(html);
    v.document.close();
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
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-blue-600" />Configurar Bookmarklet
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              El bookmarklet es un botón que guardás en tu barra de favoritos. Cuando estés en una orden de Smartier, lo clickeás y automáticamente abre esta app con los datos cargados.
            </p>
            <div className="space-y-6 mb-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Mostrá la barra de favoritos</p>
                  <p className="text-slate-500 text-sm">En Chrome: Ctrl+Shift+B (o Cmd+Shift+B en Mac)</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                <div>
                  <p className="font-semibold text-slate-900 mb-3">Arrastrá este botón a tu barra de favoritos</p>
                  <a
                    href="#"
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-5 py-3 rounded-lg cursor-move select-none shadow text-sm"
                    onClick={(e) => e.preventDefault()}
                    draggable="true"
                    onDragStart={(e) => {
                      const code = "javascript:(function(){var t=function(s){var e=document.querySelector(s);return e?e.textContent.trim():""};var numero=window.location.hash.match(/Ordenes\/(\d+)/)?.[1]||"";var cliente=t("a.nombre-cliente.ng-binding");var rep=t("a.nombre-representante.ng-binding");var prod=t(".nombre-producto.ng-binding");var ref=t(".referencia.ng-binding");var producto=ref?prod+" - "+ref:prod;var desc="";var descEl=document.querySelector(".st-card-content.ng-binding");if(descEl)desc=(descEl.innerText||descEl.textContent).trim().slice(0,400);var fechaEls=document.querySelectorAll(".fecha-value.ng-binding");var fc=fechaEls[0]?fechaEls[0].textContent.trim():"";var fe=fechaEls[1]?fechaEls[1].textContent.trim():"";var dir=t(".comentarios .ng-binding");var estado=t(".st-chip.estado-1");window.location.href="https://remitos-tgn.vercel.app?orden="+encodeURIComponent(numero)+"&cliente="+encodeURIComponent(cliente)+"&representante="+encodeURIComponent(rep)+"&producto="+encodeURIComponent(producto)+"&descripcion="+encodeURIComponent(desc)+"&fechaCreacion="+encodeURIComponent(fc)+"&fechaEntrega="+encodeURIComponent(fe)+"&direccion="+encodeURIComponent(dir)+"&estado="+encodeURIComponent(estado);})();";
                      e.dataTransfer.setData('text/uri-list', code);
                      e.dataTransfer.setData('text/plain', code);
                    }}
                  >
                    📋 Generar Remito TGN
                  </a>
                  <p className="text-slate-400 text-xs mt-2">Arrastralo a tu barra de favoritos. No lo clickees acá.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Usarlo</p>
                  <p className="text-slate-500 text-sm">Abrí cualquier orden en Smartier → clickeá el bookmark → esta app se abre con los datos listos.</p>
                </div>
              </div>
            </div>
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
                            <button onClick={() => handleImprimir(r)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition flex items-center gap-1">
                              <Printer className="w-3 h-3" />Imprimir
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
