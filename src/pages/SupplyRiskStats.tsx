import { useEffect, useState } from 'react';
import { getSupplyRisk } from '../services/api';
import type { SupplyRisk } from '../types/index';

function riskClass(score: number) {
  if (score > 100) return 'risk-high';
  if (score > 30) return 'risk-medium';
  return 'risk-low';
}

export const SupplyRiskStats = () => {
  const [risks, setRisks] = useState<SupplyRisk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSupplyRisk(50)
      .then(res => setRisks(res.data))
      .catch(() => setError('Nepodařilo se načíst statistiku rizika.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-header">Riziko výpadků dle ATC skupin</h1>
      <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Skóre rizika kombinuje počet aktivních výpadků, chybějící objem a tržní podíl.
      </p>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="status-message">Načítám statistiku...</div>}
      {!isLoading && risks.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ATC kód</th>
              <th>Název skupiny</th>
              <th>Aktivní výpadky</th>
              <th>Celkem Rx</th>
              <th>Chybějící objem</th>
              <th>Podíl na trhu</th>
              <th>Skóre rizika</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(r => (
              <tr key={r.atcCode}>
                <td><span className="badge badge-outline">{r.atcCode}</span></td>
                <td>{r.atcName || '—'}</td>
                <td>{r.activeDisruptions}</td>
                <td>{r.totalPrescriptions.toLocaleString('cs')}</td>
                <td>{r.missingVolume.toLocaleString('cs')}</td>
                <td>{(r.marketShareRatio * 100).toFixed(1)} %</td>
                <td>
                  <span className={`badge risk-badge ${riskClass(r.riskScore)}`}>
                    {r.riskScore.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && risks.length === 0 && !error && (
        <div className="status-message">Žádná data o riziku.</div>
      )}
    </div>
  );
};
