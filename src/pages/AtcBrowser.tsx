import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAtcNodes, getAtcDetail } from '../services/api';
import type { AtcNode, AtcNodeDetail } from '../types/index';

// ATC levels: 1 char, 3 chars, 4 chars, 5 chars, 7 chars
function childPrefix(code: string): RegExp {
  const len = code.length;
  const nextLens: Record<number, number> = { 1: 3, 3: 4, 4: 5, 5: 7 };
  const nextLen = nextLens[len];
  if (!nextLen) return /^$/; // leaf
  return new RegExp(`^${code}.{${nextLen - len}}$`);
}

function isLeaf(code: string) {
  return code.length === 7;
}

// Get root nodes (single-letter codes A-Z)
function rootNodes(all: AtcNode[]): AtcNode[] {
  return all.filter(n => n.code.length === 1).sort((a, b) => a.code.localeCompare(b.code));
}

function childrenOf(all: AtcNode[], parentCode: string): AtcNode[] {
  const re = childPrefix(parentCode);
  return all.filter(n => re.test(n.code)).sort((a, b) => a.code.localeCompare(b.code));
}

export const AtcBrowser = () => {
  const [allNodes, setAllNodes] = useState<AtcNode[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<AtcNode[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<AtcNode[]>([]);
  const [selected, setSelected] = useState<AtcNodeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAtcNodes()
      .then(res => {
        setAllNodes(res.data);
        setVisibleNodes(rootNodes(res.data));
      })
      .catch(() => setError('Nepodařilo se načíst ATC klasifikaci.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleNodeClick = async (node: AtcNode) => {
    if (isLeaf(node.code)) {
      setIsLoading(true);
      setSelected(null);
      try {
        const detail = await getAtcDetail(node.code);
        setSelected(detail);
        setBreadcrumb(prev => [...prev, node]);
        setVisibleNodes([]);
      } catch {
        setError('Nepodařilo se načíst ATC detail.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    const children = childrenOf(allNodes, node.code);
    setBreadcrumb(prev => [...prev, node]);
    setVisibleNodes(children);
    setSelected(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newCrumb = breadcrumb.slice(0, index);
    setBreadcrumb(newCrumb);
    setSelected(null);
    if (newCrumb.length === 0) {
      setVisibleNodes(rootNodes(allNodes));
    } else {
      const parent = newCrumb[newCrumb.length - 1];
      setVisibleNodes(childrenOf(allNodes, parent.code));
    }
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
      {isLoading && <div className="status-message">Načítám ATC strom...</div>}
      {!isLoading && (
        <>
          {selected ? (
            <div className="detail-section">
              <h2 style={{ marginTop: 0 }}>{selected.code} — {selected.name}</h2>
              <p className="text-muted">Počet léčiv: <strong>{selected.medicationCount}</strong></p>
              <Link to={`/?atc=${selected.code}`} className="doc-link" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                Zobrazit léčiva s tímto ATC
              </Link>
            </div>
          ) : (
            <ul className="item-list">
              {visibleNodes.map(n => (
                <li key={n.code} className="item-row atc-node" onClick={() => handleNodeClick(n)}>
                  <span className="atc-code badge badge-outline">{n.code}</span>
                  <span className="atc-name">{n.name}</span>
                  <span className="atc-chevron">{isLeaf(n.code) ? '·' : '›'}</span>
                </li>
              ))}
            </ul>
          )}
          {visibleNodes.length === 0 && !selected && !isLoading && (
            <div className="status-message">Žádné záznamy.</div>
          )}
        </>
      )}
    </div>
  );
};
