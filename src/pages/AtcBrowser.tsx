import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAtcNodes, getAtcDetail } from '../services/api';
import type { AtcNode, AtcNodeDetail } from '../types/index';

export const AtcBrowser = () => {
  const [breadcrumb, setBreadcrumb] = useState<AtcNode[]>([]);
  const [nodes, setNodes] = useState<AtcNode[]>([]);
  const [selected, setSelected] = useState<AtcNodeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = async (parentCode?: string) => {
    setIsLoading(true);
    setError(null);
    setSelected(null);
    try {
      const res = await getAtcNodes(parentCode);
      setNodes(res.data);
    } catch {
      setError('Nepodařilo se načíst ATC klasifikaci.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadChildren(); }, []);

  const handleNodeClick = async (node: AtcNode) => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await getAtcDetail(node.code);
      setSelected(detail);
      if (detail.children.length > 0) {
        setBreadcrumb(prev => [...prev, node]);
        setNodes(detail.children);
        setSelected(null);
      }
    } catch {
      setError('Nepodařilo se načíst ATC detail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newCrumb = breadcrumb.slice(0, index);
    setBreadcrumb(newCrumb);
    setSelected(null);
    const parentCode = newCrumb.length > 0 ? newCrumb[newCrumb.length - 1].code : undefined;
    loadChildren(parentCode);
  };

  return (
    <div className="app-container">
      <h1 className="app-header">ATC Klasifikace</h1>
      <div className="breadcrumb">
        <button className="breadcrumb-item" onClick={() => handleBreadcrumbClick(0)}>Kořen</button>
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.code}>
            <span className="breadcrumb-sep"> / </span>
            <button className="breadcrumb-item" onClick={() => handleBreadcrumbClick(i + 1)}>
              {crumb.code}
            </button>
          </span>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="status-message">Načítám...</div>}
      {!isLoading && (
        <>
          {selected ? (
            <div className="detail-section">
              <h2 style={{ marginTop: 0 }}>{selected.code} — {selected.name}</h2>
              <p className="text-muted">Úroveň: {selected.level} | Počet léčiv: <strong>{selected.medicationCount}</strong></p>
              <Link to={`/?atc=${selected.code}`} className="doc-link" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                Zobrazit léčiva s tímto ATC
              </Link>
            </div>
          ) : (
            <ul className="item-list">
              {nodes.map(n => (
                <li key={n.code} className="item-row atc-node" onClick={() => handleNodeClick(n)}>
                  <span className="atc-code badge badge-outline">{n.code}</span>
                  <span className="atc-name">{n.name}</span>
                  <span className="atc-chevron">›</span>
                </li>
              ))}
            </ul>
          )}
          {nodes.length === 0 && !selected && <div className="status-message">Žádné záznamy.</div>}
        </>
      )}
    </div>
  );
};
