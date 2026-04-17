import { Link } from 'react-router-dom';
import type { Pharmacy } from '../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

const DAY_NAMES = ['', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export const PharmacyCard = ({pharmacy}: PharmacyCardProps) => {
  return (
    <li key={pharmacy.id} className="item-row info-card">
        <Link to={`/pharmacies/${pharmacy.id}`} 
            className="clickable-card-link"
            style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
            >
            <div className="info-card-header">
                <div className="item-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                <strong>{pharmacy.name}</strong>
                </div>
            <div className="badge-row">
                {pharmacy.isMailOrder && <span className="badge badge-otc">Zásilková</span>}
                {pharmacy.isDuty && <span className="badge badge-prescription">Pohotovost</span>}
            </div>
            </div>
            <div className="text-muted small">
            {[pharmacy.street, pharmacy.city, pharmacy.postalCode].filter(Boolean).join(', ')}
            </div>
            {pharmacy.phone && <div className="text-muted small">Tel: {pharmacy.phone}</div>}
            {pharmacy.hours.length > 0 && (
            <div className="hours-row">
                {pharmacy.hours.map(h => (
                <span key={h.id} className="hour-chip">
                    {DAY_NAMES[h.dayOfWeek]}: {h.openTime}–{h.closeTime}
                </span>
                ))}
            </div>
            )}
        </Link>
    </li>
  );
}