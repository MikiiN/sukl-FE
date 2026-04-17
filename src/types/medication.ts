export interface Medication {
  suklCode: string;
  name: string;
  strength: string | null;
  formCode: string | null;
  atcCode: string | null;
  ean: string | null;
  dispensingCategoryCode: string | null;
  registrationNumber: string | null;
  
  form?: {
    code: string;
    name: string;
  };
  dispensingCategory?: {
    code: string;
    name: string;
  };
  organization?: { name: string; countryCode: string };
  compositions?: Array<{
    substance: { name: string; innName: string | null };
    amount: string | null;
    isMain: boolean;
  }>;
  documents?: Array<{
    type: 'PIL' | 'SPC' | 'PACKAGE_LEAFLET' | 'TEXT';
    url: string;
    title: string;
  }>;
  disruptions?: Array<{
    type: string;
    reportedAt: string;
    startDate: string | null;
    endDate: string | null;
    reason: string | null;
    isActive: boolean;
  }>;
  priceReports?: Array<{
    id: string;
    period: string;
    maxPrice: number | null;
    reimbursement: number | null;
    patientCopay: number | null;
    dispensingMode: string | null;
    reportedAt: string;
  }>;
}