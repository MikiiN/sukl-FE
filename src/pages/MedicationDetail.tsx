import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicationDetail } from '../services/api';
import type { Medication } from '../types/medication';

export const MedicationDetail = () => {
  const { suklCode } = useParams();
  const navigate = useNavigate();
  const [med, setMed] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (suklCode) {
      getMedicationDetail(suklCode)
        .then(setMed)
        .finally(() => setLoading(false));
    }
  }, [suklCode]);

  if (loading) return <div className="status-message">Načítám detail léku...</div>;
  if (!med) return <div className="status-message">Lék nebyl nalezen.</div>;

  const activeDisruption = med.disruptions?.find(d => d.isActive);

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="pagination-button" style={{marginBottom: '2rem'}}>
        ← Zpět na seznam
      </button>

      {activeDisruption && (
        <div className="error-message" style={{textAlign: 'left', marginBottom: '2rem'}}>
          <strong>⚠️ Pozor: Výpadek v dodávkách</strong><br />
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
    </div>
  );
};