export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Substances
export interface Substance {
  id: string;
  name: string;
  innName: string | null;
}

export interface SubstanceSynonym {
  name: string;
}

export interface SubstanceComposition {
  id: string;
  medicationSuklCode: string;
  substanceId: string;
  amount: string | null;
  unit: string | null;
  type: string;
  note: string | null;
  medication: {
    suklCode: string;
    name: string;
    strength: string | null;
    isActive: boolean;
    form: { code: string; name: string } | null;
  };
}

export interface SubstanceDetail extends Substance {
  synonyms: SubstanceSynonym[];
  compositions: SubstanceComposition[];
}

// Pharmacies
export interface PharmacyHour {
  id: string;
  pharmacyId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  note: string | null;
}

export interface Pharmacy {
  id: string;
  name: string;
  street: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  type: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  isMailOrder: boolean;
  isDuty: boolean;
  hours: PharmacyHour[];
}

// Disruptions
export interface DisruptionMedication {
  suklCode: string;
  name: string;
  atcCode: string | null;
  isActive: boolean;
}

export interface Disruption {
  id: string;
  type: string;
  reason: string | null;
  isActive: boolean;
  reportedAt: string;
  startDate: string | null;
  endDate: string | null;
  replacementSuklCode?: string | null;
  medication: DisruptionMedication;
}

export interface DisruptionWithReplacement extends Disruption {
  replacement: DisruptionMedication | null;
  replacementIsAlsoDisrupted: boolean;
}

// ATC Classification
export interface AtcNode {
  code: string;
  name: string;
  level: number;
  parentCode: string | null;
}

export interface AtcNodeDetail extends AtcNode {
  children: AtcNode[];
  medicationCount: number;
}

// Prescriptions
export interface Prescription {
  id: string;
  districtCode: string;
  districtName: string;
  year: number;
  month: number;
  quantity: number;
  medication: {
    suklCode: string;
    name: string;
    form: { code: string; name: string } | null;
    route: { code: string; name: string } | null;
    atc: { code: string; name: string } | null;
  };
}

export interface PrescriptionTotal {
  total: number;
  filters: {
    suklCode?: string;
    atcCode?: string;
    year?: number;
    month?: number;
  };
}

export interface TopMedication {
  suklCode: string;
  name: string;
  strength: string | null;
  atcCode: string | null;
  formCode: string | null;
  isActive: boolean;
  form: { code: string; name: string } | null;
  atc: { code: string; name: string } | null;
  organization: { code: string; name: string } | null;
  totalQuantity: number;
}

// Organizations
export interface Organization {
  code: string;
  name: string;
  countryCode: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
}

// Registration Changes
export interface RegistrationChange {
  id: string;
  changeType: 'NEW' | 'CANCELLED' | 'CANCELLED_EU';
  name: string;
  strength: string | null;
  formCode: string | null;
  routeCode: string | null;
  registrationNumber: string | null;
  mrpNumber: string | null;
  holder: string | null;
  effectiveDate: string | null;
  statusCode: string | null;
}

// Intermediaries
export interface Intermediary {
  ic: string;
  name: string;
  city: string | null;
  street: string | null;
  streetNumber: string | null;
  streetNumberOrient: string | null;
  isLegalPerson: boolean;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

// Supply Risk Statistics
export interface SupplyRisk {
  atcCode: string;
  atcName: string | null;
  activeDisruptions: number;
  totalPrescriptions: number;
  missingVolume: number;
  marketShareRatio: number;
  riskScore: number;
}

// Price Reports (used in MedicationDetail)
export interface PriceReport {
  id: string;
  medicationSuklCode: string;
  period: string;
  maxPrice: number | null;
  reimbursement: number | null;
  patientCopay: number | null;
  dispensingMode: string | null;
  reportedAt: string;
}
