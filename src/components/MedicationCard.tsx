import type { Medication } from '../types';

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

  return (
    <li className="medication-card">
      <div className="med-header">
        <span className="med-name">{medication.name}</span>
        {medication.strength && (
          <span className="med-strength">{formatStrength(medication.strength)}</span>
        )}
      </div>
      <div className="med-footer">
        {formName && (
          <span className="med-form" title={medication.formCode || undefined}>
            {formName}
          </span>
        )}
      </div>
    </li>
  );
};