import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubstances } from '../services/api';
import type { Substance } from '../types/index';
import { Pagination } from '../components/Pagination';

export const SubstanceList = () => {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (query: string, pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSubstances(query, pageNumber);
      setSubstances(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst látky.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load(searchInput, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="app-container">
      <h1 className="app-header">Účinné látky</h1>
      <div className="search-form">
        <input
          className="search-input"
          placeholder="Hledat látku (např. Ibuprofen)..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && substances.length === 0 && <div className="status-message">Načítám...</div>}
      {substances.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="item-list">
            {substances.map(s => (
              <li key={s.id} className="item-row">
                <Link to={`/substances/${s.id}`} className="item-link">
                  <strong>{s.name}</strong>
                  {s.innName && s.innName !== s.name && (
                    <span className="text-muted"> — INN: {s.innName}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p = Math.max(page - 1, 1); setPage(p); load(searchInput, p); }}
            onNextPage={() => { const p = Math.min(page + 1, totalPages); setPage(p); load(searchInput, p); }}
          />
        </div>
      )}
      {!isLoading && substances.length === 0 && !error && (
        <div className="status-message">Žádné látky nebyly nalezeny.</div>
      )}
    </div>
  );
};
