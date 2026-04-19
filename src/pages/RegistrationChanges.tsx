import { useEffect, useState } from 'react';
import { getRegistrationChanges } from '../services/api';
import type { RegistrationChange } from '../types/index';
import { Pagination } from '../components/Pagination';

const CHANGE_TYPE_LABELS: Record<string, string> = {
  NEW: 'Nová registrace',
  CANCELLED: 'Zrušena',
  CANCELLED_EU: 'Zrušena (EU)',
};

// badge-otc (green) for new registrations, badge-prescription (red) for cancellations.
// CANCELLED_EU is a cancellation triggered by an EU-level decision rather than the national
// authority, but carries the same clinical significance — medication no longer available.
const CHANGE_TYPE_BADGE: Record<string, string> = {
  NEW: 'badge-otc',
  CANCELLED: 'badge-prescription',
  CANCELLED_EU: 'badge-prescription',
};

export const RegistrationChanges = () => {
  const [changes, setChanges] = useState<RegistrationChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [holderInput, setHolderInput] = useState('');
  const [changeType, setChangeType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRegistrationChanges({ changeType: changeType || undefined, name: nameInput || undefined, holder: holderInput || undefined }, pageNumber);
      setChanges(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst změny registrací.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [nameInput, holderInput, changeType]);

  return (
    <div className="app-container">
      <h1 className="app-header">Změny registrací</h1>
      <div className="filter-bar">
        <input
          className="search-input filter-input"
          placeholder="Název léčiva..."
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          className="search-input filter-input"
          placeholder="Držitel (MAH)..."
          value={holderInput}
          onChange={e => setHolderInput(e.target.value)}
        />
        <select className="filter-select" value={changeType} onChange={e => setChangeType(e.target.value)}>
          <option value="">Typ: vše</option>
          {Object.entries(CHANGE_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && changes.length === 0 && <div className="status-message">Načítám...</div>}
      {changes.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Léčivo</th>
                <th>Síla / forma</th>
                <th>Držitel</th>
                <th>Typ změny</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {changes.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    {c.registrationNumber && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{c.registrationNumber}</div>}
                  </td>
                  <td>{[c.strength, c.formCode].filter(Boolean).join(' / ') || '—'}</td>
                  <td>{c.holder || '—'}</td>
                  <td>
                    <span className={`badge ${CHANGE_TYPE_BADGE[c.changeType] || 'badge-gray'}`}>
                      {CHANGE_TYPE_LABELS[c.changeType] || c.changeType}
                    </span>
                  </td>
                  <td>{c.effectiveDate ? new Date(c.effectiveDate).toLocaleDateString('cs') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p = Math.max(page - 1, 1); setPage(p); load(p); }}
            onNextPage={() => { const p = Math.min(page + 1, totalPages); setPage(p); load(p); }}
          />
        </div>
      )}
      {!isLoading && changes.length === 0 && !error && (
        <div className="status-message">Žádné změny registrací nebyly nalezeny.</div>
      )}
    </div>
  );
};
