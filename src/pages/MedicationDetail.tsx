import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicationDetail, getMedicationPrescriptions } from '../services/api';
import type { Medication } from '../types/medication';
import type { Prescription } from '../types/index';
import { Pagination } from '../components/Pagination';

export const MedicationDetail = () => {
  const { suklCode } = useParams();
  const navigate = useNavigate();
  const [med, setMed] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescPage, setPrescPage] = useState(1);
  const [prescTotalPages, setPrescTotalPages] = useState(1);
  const [prescLoading, setPrescLoading] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

  useEffect(() => {
    if (suklCode) {
      getMedicationDetail(suklCode)
        .then(setMed)
        .finally(() => setLoading(false));
    }
  }, [suklCode]);

  const loadPrescriptions = async (page: number) => {
    if (!suklCode) return;
    setPrescLoading(true);
    try {
      const res = await getMedicationPrescriptions(suklCode, {}, page);
      setPrescriptions(res.data);
      setPrescTotalPages(res.meta.totalPages);
    } finally {
      setPrescLoading(false);
    }
  };

  useEffect(() => {
    // Prescriptions are fetched lazily on first toggle to avoid a heavy query on page load.
    if (showPrescriptions && prescriptions.length === 0) loadPrescriptions(1);
  }, [showPrescriptions]);

  if (loading) return <div className="status-message">Načítám detail léku...</div>;
  if (!med) return <div className="status-message">Lék nebyl nalezen.</div>;

  // find() returns the first active disruption; multiple active disruptions for the
  // same medication are not expected by the data model (one canonical active record per med).
  const activeDisruption = med.disruptions?.find(d => d.isActive);
  // priceReports are returned by the API ordered by period desc, so index 0 is the latest.
  const latestPrice = med.priceReports?.[0];

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="pagination-button" style={{marginBottom: '2rem'}}>
        ← Zpět na seznam
      </button>

      {activeDisruption && (
        <div className="error-message" style={{textAlign: 'left', marginBottom: '2rem'}}>
          <strong>Pozor: Výpadek v dodávkách</strong><br />
          Typ: {activeDisruption.type} | Od: {activeDisruption.startDate ? new Date(activeDisruption.startDate).toLocaleDateString() : 'neuvedeno'}<br />
          {activeDisruption.reason && <em>Důvod: {activeDisruption.reason}</em>}
        </div>
      )}

      <div className="detail-header">
        <h1 className="app-header" style={{textAlign: 'left', marginBottom: '0.5rem'}}>{med.name}</h1>
        <p className="med-strength" style={{fontSize: '1.2rem'}}>{med.strength}</p>
      </div>

      <div className="detail-grid">
        <section className="detail-section">
          <h3>Základní informace</h3>
          <table className="info-table">
            <tbody>
              <tr><td>Kód SÚKL</td><td>{med.suklCode}</td></tr>
              <tr><td>EAN</td><td>{med.ean || 'Není uveden'}</td></tr>
              <tr><td>Registrační číslo</td><td>{med.registrationNumber || 'Není uvedeno'}</td></tr>
              <tr><td>ATC skupina</td><td>{med.atcCode}</td></tr>
              <tr><td>Držitel</td><td>{med.organization?.name} ({med.organization?.countryCode})</td></tr>
              {latestPrice && (
                <>
                  <tr><td>Max. cena</td><td>{latestPrice.maxPrice != null ? `${latestPrice.maxPrice} Kč` : '—'}</td></tr>
                  <tr><td>Úhrada</td><td>{latestPrice.reimbursement != null ? `${latestPrice.reimbursement} Kč` : '—'}</td></tr>
                  <tr><td>Doplatek pacienta</td><td>{latestPrice.patientCopay != null ? `${latestPrice.patientCopay} Kč` : '—'}</td></tr>
                  <tr><td>Období ceny</td><td>{latestPrice.period}</td></tr>
                </>
              )}
            </tbody>
          </table>
        </section>

        <section className="detail-section">
          <h3>Složení (Účinné látky)</h3>
          <ul className="substance-list">
            {med.compositions?.map((comp, idx) => (
              <li key={idx} className={comp.isMain ? 'main-substance' : ''}>
                <strong>{comp.substance.name}</strong>
                {comp.amount && <span> — {comp.amount}</span>}
                {comp.isMain && <span className="badge badge-gray" style={{marginLeft: '0.5rem'}}>Hlavní</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {med.documents && med.documents.length > 0 && (
        <section className="detail-section" style={{marginTop: '2rem'}}>
          <h3>Dokumenty ke stažení</h3>
          <div className="document-links">
            {med.documents.map((doc, idx) => (
              <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="doc-link">
                {doc.type === 'PIL' ? 'Příbalový leták (PIL)' : doc.type === 'SPC' ? 'Souhrn údajů (SPC)' : doc.type === 'PACKAGE_LEAFLET' ? 'Obal' : doc.title}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="detail-section" style={{marginTop: '2rem'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Statistiky preskripce</h3>
          <button
            className="pagination-button"
            onClick={() => setShowPrescriptions(v => !v)}
          >
            {showPrescriptions ? 'Skrýt' : 'Zobrazit'}
          </button>
        </div>
        {showPrescriptions && (
          <>
            {prescLoading && <div className="status-message">Načítám...</div>}
            {!prescLoading && prescriptions.length > 0 && (
              <>
                <table className="data-table">
                  <thead>
                    <tr><th>Okres</th><th>Rok</th><th>Měsíc</th><th>Množství</th></tr>
                  </thead>
                  <tbody>
                    {prescriptions.map(p => (
                      <tr key={p.id}>
                        <td>{p.districtName} <span className="text-muted">({p.districtCode})</span></td>
                        <td>{p.year}</td>
                        <td>{p.month}</td>
                        <td><strong>{p.quantity.toLocaleString('cs')}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={prescPage}
                  totalPages={prescTotalPages}
                  onPrevPage={() => { const p = Math.max(prescPage - 1, 1); setPrescPage(p); loadPrescriptions(p); }}
                  onNextPage={() => { const p = Math.min(prescPage + 1, prescTotalPages); setPrescPage(p); loadPrescriptions(p); }}
                />
              </>
            )}
            {!prescLoading && prescriptions.length === 0 && (
              <div className="status-message" style={{ padding: '1rem' }}>Žádná data preskripce.</div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
