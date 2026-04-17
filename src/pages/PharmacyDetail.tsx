import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPharmacyDetail } from '../services/api';
import type { Pharmacy } from '../types/index';

const DAY_NAMES = ['', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

export const PharmacyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPharmacyDetail(id)
      .then(setPharmacy)
      .catch(() => setError('Lékárna nebyla nalezena.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="status-message">Načítám detail lékárny...</div>;
  if (error || !pharmacy) return <div className="error-message">{error || 'Lékárna nebyla nalezena.'}</div>;

  const sortedHours = [...pharmacy.hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="pagination-button" style={{ marginBottom: '2rem' }}>
        ← Zpět na seznam
      </button>
      <div className="detail-header">
        <h1 className="app-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{pharmacy.name}</h1>
        <div className="badge-row" style={{ marginBottom: '1rem' }}>
          {pharmacy.isMailOrder && <span className="badge badge-otc">Zásilková</span>}
          {pharmacy.isDuty && <span className="badge badge-prescription">Pohotovostní</span>}
          {pharmacy.type && <span className="badge badge-gray">{pharmacy.type}</span>}
        </div>
      </div>
      <div className="detail-grid">
        <section className="detail-section">
          <h3>Kontakt a adresa</h3>
          <table className="info-table">
            <tbody>
              <tr><td>Adresa</td><td>{[pharmacy.street, pharmacy.city, pharmacy.postalCode].filter(Boolean).join(', ') || '—'}</td></tr>
              <tr><td>Stát</td><td>{pharmacy.country || '—'}</td></tr>
              <tr><td>Telefon</td><td>{pharmacy.phone || '—'}</td></tr>
              <tr><td>E-mail</td><td>{pharmacy.email || '—'}</td></tr>
              <tr><td>Web</td><td>{pharmacy.website ? <a href={pharmacy.website} target="_blank" rel="noreferrer">{pharmacy.website}</a> : '—'}</td></tr>
              <tr><td>ID</td><td><code>{pharmacy.id}</code></td></tr>
            </tbody>
          </table>
        </section>
        {sortedHours.length > 0 && (
          <section className="detail-section">
            <h3>Otevírací doba</h3>
            <table className="info-table">
              <tbody>
                {sortedHours.map(h => (
                  <tr key={h.id}>
                    <td>{DAY_NAMES[h.dayOfWeek]}</td>
                    <td>{h.openTime} – {h.closeTime}{h.note ? ` (${h.note})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};
