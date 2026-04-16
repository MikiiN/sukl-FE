import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizations } from '../services/api';
import type { Organization } from '../types/index';
import { Pagination } from '../components/Pagination';

export const OrganizationList = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOrganizations(nameInput, countryInput, pageNumber);
      setOrgs(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst organizace.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [nameInput, countryInput]);

  return (
    <div className="app-container">
      <h1 className="app-header">Organizace (držitelé registrace)</h1>
      <div className="filter-bar">
        <input
          className="search-input filter-input"
          placeholder="Název organizace..."
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          className="search-input filter-input"
          placeholder="Kód země (např. CZ)..."
          value={countryInput}
          onChange={e => setCountryInput(e.target.value)}
          style={{ maxWidth: '150px' }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && orgs.length === 0 && <div className="status-message">Načítám...</div>}
      {orgs.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="item-list">
            {orgs.map(org => (
              <li key={org.code} className="item-row info-card">
                <div className="info-card-header">
                  <Link to={`/organizations/${org.code}`} className="item-link">
                    <strong>{org.name}</strong>
                  </Link>
                  {org.countryCode && <span className="badge badge-gray">{org.countryCode}</span>}
                </div>
                {org.address && <div className="text-muted small">{org.address}</div>}
                {org.email && <div className="text-muted small">{org.email}</div>}
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
      {!isLoading && orgs.length === 0 && !error && (
        <div className="status-message">Žádné organizace nebyly nalezeny.</div>
      )}
    </div>
  );
};
