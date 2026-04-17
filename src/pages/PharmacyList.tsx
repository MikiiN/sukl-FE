import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPharmacies } from '../services/api';
import type { Pharmacy } from '../types/index';
import { Pagination } from '../components/Pagination';

const DAY_NAMES = ['', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export const PharmacyList = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [isMailOrder, setIsMailOrder] = useState<boolean | undefined>(undefined);
  const [isDuty, setIsDuty] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPharmacies({ name: nameInput, city: cityInput, isMailOrder, isDuty }, pageNumber);
      setPharmacies(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst lékárny.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [nameInput, cityInput, isMailOrder, isDuty]);

  return (
    <div className="app-container">
      <h1 className="app-header">Lékárny</h1>
      <div className="filter-bar">
        <input
          className="search-input filter-input"
          placeholder="Název lékárny..."
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          className="search-input filter-input"
          placeholder="Město..."
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
        />
        <label className="filter-checkbox">
          <input type="checkbox" checked={isMailOrder === true} onChange={e => setIsMailOrder(e.target.checked ? true : undefined)} />
          Zásilkové
        </label>
        <label className="filter-checkbox">
          <input type="checkbox" checked={isDuty === true} onChange={e => setIsDuty(e.target.checked ? true : undefined)} />
          Pohotovostní
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && pharmacies.length === 0 && <div className="status-message">Načítám...</div>}
      {pharmacies.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="item-list">
            {pharmacies.map(ph => (
              <li key={ph.id} className="item-row info-card">
                  <Link to={`/pharmacies/${ph.id}`} 
                    className="clickable-card-link"
                    style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
                  >
                  <div className="info-card-header">
                      <div className="item-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                        <strong>{ph.name}</strong>
                      </div>
                    <div className="badge-row">
                      {ph.isMailOrder && <span className="badge badge-otc">Zásilková</span>}
                      {ph.isDuty && <span className="badge badge-prescription">Pohotovost</span>}
                    </div>
                  </div>
                  <div className="text-muted small">
                    {[ph.street, ph.city, ph.postalCode].filter(Boolean).join(', ')}
                  </div>
                  {ph.phone && <div className="text-muted small">Tel: {ph.phone}</div>}
                  {ph.hours.length > 0 && (
                    <div className="hours-row">
                      {ph.hours.map(h => (
                        <span key={h.id} className="hour-chip">
                          {DAY_NAMES[h.dayOfWeek]}: {h.openTime}–{h.closeTime}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
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
      {!isLoading && pharmacies.length === 0 && !error && (
        <div className="status-message">Žádné lékárny nebyly nalezeny.</div>
      )}
    </div>
  );
};
