import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDisruptions,
  getActiveDisruptions,
  getActiveDisruptionsWithReplacement,
} from '../services/api';
import type { Disruption, DisruptionWithReplacement } from '../types/index';
import { Pagination } from '../components/Pagination';

type Tab = 'all' | 'active' | 'replacement';

const TYPE_LABELS: Record<string, string> = {
  START: 'Zahájení',
  INTERRUPTION: 'Přerušení',
  ENDED: 'Ukončení',
  RESUMED: 'Obnovení',
};

export const DisruptionList = () => {
  const [tab, setTab] = useState<Tab>('active');
  const [disruptions, setDisruptions] = useState<(Disruption | DisruptionWithReplacement)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [atcFilter, setAtcFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = { atc: atcFilter, type: typeFilter };
      let res;
      if (tab === 'all') res = await getDisruptions(filters, pageNumber);
      else if (tab === 'active') res = await getActiveDisruptions(filters, pageNumber);
      else res = await getActiveDisruptionsWithReplacement(filters, pageNumber);
      setDisruptions(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst výpadky.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 400ms debounce — waits for the user to stop typing before firing a request.
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [tab, atcFilter, typeFilter]);

  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="app-header">Výpadky léčiv</h1>
      <div className="tab-bar">
        {(['active', 'replacement', 'all'] as Tab[]).map(t => (
          <button
            key={t}
            className={`tab-button${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? 'Všechny' : t === 'active' ? 'Aktivní' : 'Aktivní + náhrady'}
          </button>
        ))}
      </div>
      <div className="filter-bar">
        <input
          className="search-input filter-input"
          placeholder="ATC kód (např. M01AE)..."
          value={atcFilter}
          onChange={e => setAtcFilter(e.target.value)}
        />
        <select
          className="filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">Typ: vše</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && disruptions.length === 0 && <div className="status-message">Načítám...</div>}
      {disruptions.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="item-list">
            {disruptions.map(d => {
              const wr = d as DisruptionWithReplacement;
              return (
                <li key={d.id} 
                className="item-row info-card clickable-card"
                onClick={() => navigate(`/${d.medication.suklCode}`)}
                >
                  <div className="info-card-header">
                    <div className="item-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                      <strong>{d.medication.name}</strong>
                    </div>
                    <div className="badge-row">
                      <span className={`badge ${d.isActive ? 'badge-prescription' : 'badge-gray'}`}>
                        {TYPE_LABELS[d.type] || d.type}
                      </span>
                      {d.medication.atcCode && (
                        <span className="badge badge-outline">{d.medication.atcCode}</span>
                      )}
                    </div>
                  </div>
                  {d.reason && <div className="text-muted small">Důvod: {d.reason}</div>}
                  <div className="text-muted small">
                    Od: {d.startDate ? new Date(d.startDate).toLocaleDateString('cs') : '—'}
                    {d.endDate && ` — Do: ${new Date(d.endDate).toLocaleDateString('cs')}`}
                  </div>
                  {tab === 'replacement' && wr.replacement && (
                    <div className="replacement-info">
                      Náhrada:{' '}
                      <Link 
                        to={`/${wr.replacement.suklCode}`} 
                        className="item-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {wr.replacement.name}
                      </Link>
                      {wr.replacementIsAlsoDisrupted && (
                        <span className="badge badge-prescription" style={{ marginLeft: '0.5rem' }}>
                          Také výpadek!
                        </span>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p = Math.max(page - 1, 1); setPage(p); load(p); }}
            onNextPage={() => { const p = Math.min(page + 1, totalPages); setPage(p); load(p); }}
          />
        </div>
      )}
      {!isLoading && disruptions.length === 0 && !error && (
        <div className="status-message">Žádné výpadky nebyly nalezeny.</div>
      )}
    </div>
  );
};
