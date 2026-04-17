import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrescriptions, getTopMedications, getPrescriptionsTotal } from '../services/api';
import type { Prescription, TopMedication, PrescriptionTotal } from '../types/index';
import { Pagination } from '../components/Pagination';

type Tab = 'top' | 'filter';

export const PrescriptionStats = () => {
  const [tab, setTab] = useState<Tab>('top');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [topMeds, setTopMeds] = useState<TopMedication[]>([]);
  const [total, setTotal] = useState<PrescriptionTotal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suklCode, setSuklCode] = useState('');
  const [atcCode, setAtcCode] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTop = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTopMedications({ atcCode: atcCode || undefined }, pageNumber);
      setTopMeds(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setError('Nepodařilo se načíst top léčiva.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiltered = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        suklCode: suklCode || undefined,
        atcCode: atcCode || undefined,
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
        districtCode: districtCode || undefined,
      };
      const [res, tot] = await Promise.all([
        getPrescriptions(filters, pageNumber),
        getPrescriptionsTotal({ suklCode: filters.suklCode, atcCode: filters.atcCode, year: filters.year, month: filters.month }),
      ]);
      setPrescriptions(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(tot);
    } catch {
      setError('Nepodařilo se načíst data preskripce.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      if (tab === 'top') loadTop(1);
      else loadFiltered(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [tab, suklCode, atcCode, year, month, districtCode]);

  return (
    <div className="app-container">
      <h1 className="app-header">Statistiky preskripce</h1>
      <div className="tab-bar">
        <button className={`tab-button${tab === 'top' ? ' active' : ''}`} onClick={() => setTab('top')}>
          Nejprescribovanější
        </button>
        <button className={`tab-button${tab === 'filter' ? ' active' : ''}`} onClick={() => setTab('filter')}>
          Hledat dle filtru
        </button>
      </div>
      <div className="filter-bar">
        {tab === 'filter' && (
          <>
            <input className="search-input filter-input" placeholder="Kód SÚKL..." value={suklCode} onChange={e => setSuklCode(e.target.value)} />
            <input className="search-input filter-input" placeholder="Okres (kód)..." value={districtCode} onChange={e => setDistrictCode(e.target.value)} />
            <input className="search-input filter-input" placeholder="Rok (např. 2025)..." value={year} onChange={e => setYear(e.target.value)} />
            <input className="search-input filter-input" placeholder="Měsíc (1-12)..." value={month} onChange={e => setMonth(e.target.value)} />
          </>
        )}
        <input className="search-input filter-input" placeholder="ATC kód..." value={atcCode} onChange={e => setAtcCode(e.target.value)} />
      </div>

      {tab === 'filter' && total && (
        <div className="total-badge">
          Celkem předepsáno: <strong>{total.total.toLocaleString('cs')}</strong> balení
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="status-message">Načítám...</div>}

      {!isLoading && tab === 'top' && topMeds.length > 0 && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Léčivo</th>
                <th>ATC</th>
                <th>Předepsáno (ks)</th>
              </tr>
            </thead>
            <tbody>
              {topMeds.map((m, i) => (
                <tr key={m.suklCode}>
                  <td className="text-muted">{(page - 1) * 20 + i + 1}</td>
                  <td>
                    <Link to={`/${m.suklCode}`} className="item-link">{m.name}</Link>
                    {m.strength && <span className="text-muted"> {m.strength}</span>}
                  </td>
                  <td><span className="badge badge-outline">{m.atcCode || '—'}</span></td>
                  <td><strong>{m.totalQuantity.toLocaleString('cs')}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p = Math.max(page - 1, 1); setPage(p); loadTop(p); }}
            onNextPage={() => { const p = Math.min(page + 1, totalPages); setPage(p); loadTop(p); }}
          />
        </div>
      )}

      {!isLoading && tab === 'filter' && prescriptions.length > 0 && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Léčivo</th>
                <th>Okres</th>
                <th>Období</th>
                <th>Množství</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(p => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/${p.medication.suklCode}`} className="item-link">{p.medication.name}</Link>
                  </td>
                  <td>{p.districtName} <span className="text-muted">({p.districtCode})</span></td>
                  <td>{p.year}/{String(p.month).padStart(2, '0')}</td>
                  <td><strong>{p.quantity.toLocaleString('cs')}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={() => { const p2 = Math.max(page - 1, 1); setPage(p2); loadFiltered(p2); }}
            onNextPage={() => { const p2 = Math.min(page + 1, totalPages); setPage(p2); loadFiltered(p2); }}
          />
        </div>
      )}

      {!isLoading && (tab === 'top' ? topMeds : prescriptions).length === 0 && !error && (
        <div className="status-message">Žádná data.</div>
      )}
    </div>
  );
};
