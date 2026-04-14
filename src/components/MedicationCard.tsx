import type { Medication } from '../types/medication';
import { Link } from 'react-router-dom';

interface MedicationCardProps {
  medication: Medication;
  formName: string | null; 
}

export const MedicationCard = ({ medication, formName }: MedicationCardProps) => {
  
  const formatStrength = (strength: string | null) => {
    if (!strength) return null;
    const formatted = strength.toLowerCase().replace(/(\d)([a-zA-Z])/g, '$1 $2');
    return formatted
      .replace(/\bgbq\b/g, 'GBq')
      .replace(/\bmbq\b/g, 'MBq')
      .replace(/\biu\b/g, 'IU')
      .replace(/\bu\b/g, 'U');
  };

  const getDispensingBadge = (code: string | null, name: string | undefined) => {
    if (!code) return null;
    
    switch (code) {
      case 'V': 
        return <span className="badge badge-prescription" title="Vázán na lékařský předpis">{name}</span>;
      case 'R': 
        return <span className="badge badge-prescription" title="Vázán na lékařský předpis s omezením">{name}</span>;
      case 'O': 
        return <span className="badge badge-otc" title="Volně prodejné v lékárně">{name}</span>;
      case 'F': 
        return <span className="badge badge-otc" title="Vyhrazený přípravek (prodej i mimo lékárny)">{name}</span>;
      default:
        return <span className="badge badge-gray">Výdej: {code}</span>;
    }
  };

  return (
    <Link to={`/${medication.suklCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <li className="medication-card">
        <div className="med-header">
          <span className="med-name">{medication.name}</span>
          {medication.strength && (
            <span className="med-strength">{formatStrength(medication.strength)}</span>
          )}
          
          <div className="med-badges">
            {getDispensingBadge(medication.dispensingCategoryCode, medication.dispensingCategory?.name)}
            {medication.atcCode && (
              <span className="badge badge-outline" title="ATC kód skupiny">
                ATC: {medication.atcCode}
              </span>
            )}
          </div>

        </div>

        <div className="med-footer">
          <div className="med-codes">
            {medication.ean && <span className="med-code">EAN: {medication.ean}</span>}
          </div>
          {formName && (
            <span className="med-form" title={medication.formCode || undefined}>
              {formName}
            </span>
          )}
        </div>
      </li>
    </Link>
  );
};