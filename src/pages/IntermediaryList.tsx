import { useEffect, useState } from 'react';
import { getIntermediaries } from '../services/api';
import type { Intermediary } from '../types/index';
import { Pagination } from '../components/Pagination';

export const IntermediaryList = () => {
  const [items, setItems] = useState<Intermediary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getIntermediaries(nameInput, cityInput, pageNumber);
      setItems(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst zprostředkovatele.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [nameInput, cityInput]);

  return (
    <div className="app-container">
      <h1 className="app-header">Zprostředkovatelé distribuce</h1>
      <div className="filter-bar">
        <input
          className="search-input filter-input"
          placeholder="Název..."
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          className="search-input filter-input"
          placeholder="Město..."
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && items.length === 0 && <div className="status-message">Načítám...</div>}
      {items.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="item-list">
            {items.map(item => (
              <li key={item.ic} className="item-row info-card">
                <div className="info-card-header">
                  <strong>{item.name}</strong>
                  <span className="badge badge-gray">IČ: {item.ic}</span>
                </div>
                <div className="text-muted small">
                  {[item.street, item.streetNumber, item.city].filter(Boolean).join(' ')}
                </div>
                {item.phone && <div className="text-muted small">Tel: {item.phone}</div>}
                {item.email && <div className="text-muted small">E-mail: {item.email}</div>}
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p = Math.max(page - 1, 1); setPage(p); load(p); }}
            onNextPage={() => { const p = Math.min(page + 1, totalPages); setPage(p); load(p); }}
          />
        </div>
      )}
      {!isLoading && items.length === 0 && !error && (
        <div className="status-message">Žádní zprostředkovatelé nebyli nalezeni.</div>
      )}
    </div>
  );
};
