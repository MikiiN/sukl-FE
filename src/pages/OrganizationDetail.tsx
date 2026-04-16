import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrganizationDetail, getOrganizationMedications, getOrganizationDisruptions } from '../services/api';
import type { Organization, Disruption } from '../types/index';
import type { Medication } from '../types/medication';
import { Pagination } from '../components/Pagination';

type Tab = 'info' | 'medications' | 'disruptions';

export const OrganizationDetail = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('info');

  const [meds, setMeds] = useState<Medication[]>([]);
  const [medsPage, setMedsPage] = useState(1);
  const [medsTotalPages, setMedsTotalPages] = useState(1);
  const [medsLoading, setMedsLoading] = useState(false);

  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [dispPage, setDispPage] = useState(1);
  const [dispTotalPages, setDispTotalPages] = useState(1);
  const [dispLoading, setDispLoading] = useState(false);

  useEffect(() => {
    if (!code) return;
    getOrganizationDetail(code)
      .then(setOrg)
      .catch(() => setError('Organizace nebyla nalezena.'))
      .finally(() => setLoading(false));
  }, [code]);

  const loadMeds = async (p: number) => {
    if (!code) return;
    setMedsLoading(true);
    try {
      const res = await getOrganizationMedications(code, p);
      setMeds(res.data);
      setMedsTotalPages(res.meta.totalPages);
    } finally {
      setMedsLoading(false);
    }
  };

  const loadDisruptions = async (p: number) => {
    if (!code) return;
    setDispLoading(true);
    try {
      const res = await getOrganizationDisruptions(code, p);
      setDisruptions(res.data);
      setDispTotalPages(res.meta.totalPages);
    } finally {
      setDispLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'medications' && meds.length === 0) loadMeds(1);
    if (tab === 'disruptions' && disruptions.length === 0) loadDisruptions(1);
  }, [tab]);

  if (loading) return <div className="status-message">Načítám...</div>;
  if (error || !org) return <div className="error-message">{error || 'Organizace nebyla nalezena.'}</div>;

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="pagination-button" style={{ marginBottom: '2rem' }}>
        ← Zpět
      </button>
      <h1 className="app-header" style={{ textAlign: 'left' }}>{org.name}</h1>
      <div className="tab-bar">
        {(['info', 'medications', 'disruptions'] as Tab[]).map(t => (
          <button key={t} className={`tab-button${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'info' ? 'Info' : t === 'medications' ? 'Léčiva' : 'Výpadky'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <section className="detail-section" style={{ marginTop: '1rem' }}>
          <table className="info-table">
            <tbody>
              <tr><td>Kód</td><td><code>{org.code}</code></td></tr>
              <tr><td>Země</td><td>{org.countryCode || '—'}</td></tr>
              <tr><td>Adresa</td><td>{org.address || '—'}</td></tr>
              <tr><td>E-mail</td><td>{org.email || '—'}</td></tr>
              <tr><td>Telefon</td><td>{org.phone || '—'}</td></tr>
              <tr><td>Web</td><td>{org.website ? <a href={org.website} target="_blank" rel="noreferrer">{org.website}</a> : '—'}</td></tr>
            </tbody>
          </table>
        </section>
      )}

      {tab === 'medications' && (
        <div style={{ marginTop: '1rem' }}>
          {medsLoading && <div className="status-message">Načítám...</div>}
          {!medsLoading && (
            <>
              <ul className="item-list">
                {meds.map(m => (
                  <li key={m.suklCode} className="item-row">
                    <Link to={`/${m.suklCode}`} className="item-link">{m.name}</Link>
                    {m.form && <span className="badge badge-gray" style={{ marginLeft: '0.5rem' }}>{m.form.name}</span>}
                  </li>
                ))}
              </ul>
              {meds.length > 0 && (
                <Pagination
                  currentPage={medsPage}
                  totalPages={medsTotalPages}
                  onPrevPage={() => { const p = Math.max(medsPage - 1, 1); setMedsPage(p); loadMeds(p); }}
                  onNextPage={() => { const p = Math.min(medsPage + 1, medsTotalPages); setMedsPage(p); loadMeds(p); }}
                />
              )}
              {meds.length === 0 && <div className="status-message">Žádná léčiva.</div>}
            </>
          )}
        </div>
      )}

      {tab === 'disruptions' && (
        <div style={{ marginTop: '1rem' }}>
          {dispLoading && <div className="status-message">Načítám...</div>}
          {!dispLoading && (
            <>
              <ul className="item-list">
                {disruptions.map(d => (
                  <li key={d.id} className="item-row info-card">
                    <div className="info-card-header">
                      <Link to={`/${d.medication.suklCode}`} className="item-link">{d.medication.name}</Link>
                      <span className={`badge ${d.isActive ? 'badge-prescription' : 'badge-gray'}`}>{d.type}</span>
                    </div>
                    {d.reason && <div className="text-muted small">{d.reason}</div>}
                    <div className="text-muted small">
                      Od: {d.startDate ? new Date(d.startDate).toLocaleDateString('cs') : '—'}
                    </div>
                  </li>
                ))}
              </ul>
              {disruptions.length > 0 && (
                <Pagination
                  currentPage={dispPage}
                  totalPages={dispTotalPages}
                  onPrevPage={() => { const p = Math.max(dispPage - 1, 1); setDispPage(p); loadDisruptions(p); }}
                  onNextPage={() => { const p = Math.min(dispPage + 1, dispTotalPages); setDispPage(p); loadDisruptions(p); }}
                />
              )}
              {disruptions.length === 0 && <div className="status-message">Žádné výpadky.</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
};
