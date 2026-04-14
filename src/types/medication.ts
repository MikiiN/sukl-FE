export interface Medication {
  suklCode: string;
  name: string;
  strength: string | null;
  formCode: string | null;
  atcCode: string | null;
  ean: string | null;
  dispensingCategoryCode: string | null;
  registrationNumber: string | null;
  
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
}