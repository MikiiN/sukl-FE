import { Link } from 'react-router-dom';
import type { Substance } from '../types';

interface SubstanceCardProps {
    substance: Substance;
}

export const SubstanceCard = ({substance}: SubstanceCardProps) => {
    return (
        <li key={substance.id} className="item-row" style={{ padding: 0, overflow: 'hidden' }}>
            <Link 
                to={`/substances/${substance.id}`} 
                className="item-link clickable-card-link"
                style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
            >
                <strong>{substance.name}</strong>
                {substance.innName && substance.innName !== substance.name && (
                <span className="text-muted"> — INN: {substance.innName}</span>
                )}
            </Link>
        </li>
    );
}