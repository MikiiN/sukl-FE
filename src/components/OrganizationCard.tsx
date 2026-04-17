import { Link } from 'react-router-dom';
import type { Organization } from '../types';

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  return (
    <li className="item-row info-card" style={{ padding: 0, overflow: 'hidden' }}>
      <Link 
        to={`/organizations/${organization.code}`} 
        className="clickable-card-link"
        style={{ display: 'block', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
      >
        <div className="info-card-header">
          <div className="item-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
            <strong>{organization.name}</strong>
          </div>
          {organization.countryCode && (
            <span className="badge badge-gray">{organization.countryCode}</span>
          )}
        </div>
        
        {organization.address && (
          <div className="text-muted small">{organization.address}</div>
        )}
        
        {organization.email && (
          <div className="text-muted small">{organization.email}</div>
        )}
      </Link>
    </li>
  );
};