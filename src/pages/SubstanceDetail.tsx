import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubstanceDetail } from '../services/api';
import type { SubstanceDetail as SubstanceDetailType } from '../types/index';

export const SubstanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [substance, setSubstance] = useState<SubstanceDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSubstanceDetail(id)
      .then(setSubstance)
      .catch(() => setError('Látka nebyla nalezena.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="status-message">Načítám detail látky...</div>;
  if (error || !substance) return <div className="error-message">{error || 'Látka nebyla nalezena.'}</div>;

  const medications = substance.compositions.map(c => c.medication);

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="pagination-button" style={{ marginBottom: '2rem' }}>
        ← Zpět
      </button>
      <h1 className="app-header" style={{ textAlign: 'left' }}>{substance.name}</h1>
      {substance.innName && substance.innName !== substance.name && (
        <p className="text-muted" style={{ marginBottom: '2rem' }}>INN: {substance.innName}</p>
      )}
      <div className="detail-grid">
        {substance.synonyms.length > 0 && (
          <section className="detail-section">
            <h3>Synonyma</h3>
            <ul className="substance-list">
              {substance.synonyms.map((s, i) => <li key={i}>{s.name}</li>)}
            </ul>
          </section>
        )}
        <section className="detail-section">
          <h3>Léčiva obsahující tuto látku ({medications.length})</h3>
          <ul className="substance-list">
            {medications.map(med => (
              <li key={med.suklCode}>
                <Link to={`/${med.suklCode}`} className="item-link">
                  {med.name}
                  {med.strength && <span className="text-muted"> {med.strength}</span>}
                </Link>
                {med.form && <span className="badge badge-gray" style={{ marginLeft: '0.5rem' }}>{med.form.name}</span>}
                {!med.isActive && <span className="badge badge-gray" style={{ marginLeft: '0.5rem', opacity: 0.5 }}>Neaktivní</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
