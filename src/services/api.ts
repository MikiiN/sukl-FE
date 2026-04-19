import type { Medication } from '../types/medication';
import type {
  PaginatedResponse,
  Substance,
  SubstanceDetail,
  SubstanceComposition,
  Pharmacy,
  Disruption,
  DisruptionWithReplacement,
  AtcNode,
  AtcNodeDetail,
  Prescription,
  PrescriptionTotal,
  TopMedication,
  Organization,
  RegistrationChange,
  SupplyRisk,
} from '../types/index';

export type { PaginatedResponse };

const API_BASE_URL = 'http://localhost:3000';

async function apiFetch<T>(url: URL | string): Promise<T> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `HTTP ${response.status}`);
  }
  return response.json();
}


export const getMedications = async (
  query: string = '',
  page: number = 1,
  limit: number = 21
): Promise<PaginatedResponse<Medication>> => {
  const url = new URL(`${API_BASE_URL}/medications`);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('page', page.toString());
  if (query) url.searchParams.set('name', query);
  return apiFetch(url);
};

export const getMedicationDetail = async (suklCode: string): Promise<Medication> => {
  return apiFetch(`${API_BASE_URL}/medications/${suklCode}`);
};

export const getMedicationPrescriptions = async (
  suklCode: string,
  filters: { districtCode?: string; year?: number; month?: number } = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Prescription>> => {
  const url = new URL(`${API_BASE_URL}/medications/${suklCode}/prescriptions`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.districtCode) url.searchParams.set('districtCode', filters.districtCode);
  if (filters.year) url.searchParams.set('year', filters.year.toString());
  if (filters.month) url.searchParams.set('month', filters.month.toString());
  return apiFetch(url);
};


export const getSubstances = async (
  name: string = '',
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Substance>> => {
  const url = new URL(`${API_BASE_URL}/substances`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (name) url.searchParams.set('name', name);
  return apiFetch(url);
};

export const getSubstanceDetail = async (id: string): Promise<SubstanceDetail> => {
  return apiFetch(`${API_BASE_URL}/substances/${id}`);
};

export const getSubstanceMedications = async (
  id: string,
  page: number = 1,
  limit: number = 20
): Promise<{ substance: Substance; data: SubstanceComposition['medication'][]; meta: PaginatedResponse<unknown>['meta'] }> => {
  const url = new URL(`${API_BASE_URL}/substances/${id}/medications`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  return apiFetch(url);
};


export const getPharmacies = async (
  filters: { name?: string; city?: string; postalCode?: string; isMailOrder?: boolean; isDuty?: boolean } = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Pharmacy>> => {
  const url = new URL(`${API_BASE_URL}/pharmacies`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.name) url.searchParams.set('name', filters.name);
  if (filters.city) url.searchParams.set('city', filters.city);
  if (filters.postalCode) url.searchParams.set('postalCode', filters.postalCode);
  if (filters.isMailOrder !== undefined) url.searchParams.set('isMailOrder', filters.isMailOrder.toString());
  if (filters.isDuty !== undefined) url.searchParams.set('isDuty', filters.isDuty.toString());
  return apiFetch(url);
};

export const getPharmacyDetail = async (id: string): Promise<Pharmacy> => {
  return apiFetch(`${API_BASE_URL}/pharmacies/${id}`);
};


type DisruptionFilters = {
  atc?: string;
  suklCode?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
};

export const getDisruptions = async (
  filters: DisruptionFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Disruption>> => {
  const url = new URL(`${API_BASE_URL}/disruptions`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.atc) url.searchParams.set('atc', filters.atc);
  if (filters.suklCode) url.searchParams.set('suklCode', filters.suklCode);
  if (filters.type) url.searchParams.set('type', filters.type);
  if (filters.dateFrom) url.searchParams.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) url.searchParams.set('dateTo', filters.dateTo);
  return apiFetch(url);
};

export const getActiveDisruptions = async (
  filters: DisruptionFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Disruption>> => {
  const url = new URL(`${API_BASE_URL}/disruptions/active`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.atc) url.searchParams.set('atc', filters.atc);
  if (filters.suklCode) url.searchParams.set('suklCode', filters.suklCode);
  if (filters.type) url.searchParams.set('type', filters.type);
  return apiFetch(url);
};

export const getActiveDisruptionsWithReplacement = async (
  filters: DisruptionFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<DisruptionWithReplacement>> => {
  const url = new URL(`${API_BASE_URL}/disruptions/active/with-replacement`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.atc) url.searchParams.set('atc', filters.atc);
  if (filters.suklCode) url.searchParams.set('suklCode', filters.suklCode);
  return apiFetch(url);
};

export const getDisruptionHistory = async (
  suklCode: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Disruption>> => {
  const url = new URL(`${API_BASE_URL}/disruptions/${suklCode}`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  return apiFetch(url);
};


export const getAtcNodes = async (parent?: string): Promise<{ data: AtcNode[] }> => {
  const url = new URL(`${API_BASE_URL}/atc`);
  if (parent) url.searchParams.set('parent', parent);
  return apiFetch(url);
};

export const getAtcDetail = async (code: string): Promise<AtcNodeDetail> => {
  return apiFetch(`${API_BASE_URL}/atc/${code}`);
};


type PrescriptionFilters = {
  suklCode?: string;
  districtCode?: string;
  atcCode?: string;
  year?: number;
  month?: number;
};

export const getPrescriptions = async (
  filters: PrescriptionFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Prescription>> => {
  const url = new URL(`${API_BASE_URL}/prescriptions`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.suklCode) url.searchParams.set('suklCode', filters.suklCode);
  if (filters.districtCode) url.searchParams.set('districtCode', filters.districtCode);
  if (filters.atcCode) url.searchParams.set('atcCode', filters.atcCode);
  if (filters.year) url.searchParams.set('year', filters.year.toString());
  if (filters.month) url.searchParams.set('month', filters.month.toString());
  return apiFetch(url);
};

// getPrescriptionsTotal omits districtCode by type — the total aggregates nationally,
// not per district. The Omit<> enforces this at the call site.
export const getPrescriptionsTotal = async (
  filters: Omit<PrescriptionFilters, 'districtCode'> = {}
): Promise<PrescriptionTotal> => {
  const url = new URL(`${API_BASE_URL}/prescriptions/total`);
  if (filters.suklCode) url.searchParams.set('suklCode', filters.suklCode);
  if (filters.atcCode) url.searchParams.set('atcCode', filters.atcCode);
  if (filters.year) url.searchParams.set('year', filters.year.toString());
  if (filters.month) url.searchParams.set('month', filters.month.toString());
  return apiFetch(url);
};

export const getTopMedications = async (
  filters: { districtCode?: string; atcCode?: string } = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<TopMedication>> => {
  const url = new URL(`${API_BASE_URL}/prescriptions/top`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.districtCode) url.searchParams.set('districtCode', filters.districtCode);
  if (filters.atcCode) url.searchParams.set('atcCode', filters.atcCode);
  return apiFetch(url);
};


export const getOrganizations = async (
  name: string = '',
  country: string = '',
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Organization>> => {
  const url = new URL(`${API_BASE_URL}/organizations`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (name) url.searchParams.set('name', name);
  if (country) url.searchParams.set('country', country);
  return apiFetch(url);
};

export const getOrganizationDetail = async (code: string): Promise<Organization> => {
  return apiFetch(`${API_BASE_URL}/organizations/${code}`);
};

export const getOrganizationMedications = async (
  code: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Medication>> => {
  const url = new URL(`${API_BASE_URL}/organizations/${code}/medications`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  return apiFetch(url);
};

export const getOrganizationDisruptions = async (
  code: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Disruption>> => {
  const url = new URL(`${API_BASE_URL}/organizations/${code}/disruptions`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  return apiFetch(url);
};


export const getRegistrationChanges = async (
  filters: { changeType?: string; name?: string; holder?: string } = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<RegistrationChange>> => {
  const url = new URL(`${API_BASE_URL}/registration-changes`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (filters.changeType) url.searchParams.set('changeType', filters.changeType);
  if (filters.name) url.searchParams.set('name', filters.name);
  if (filters.holder) url.searchParams.set('holder', filters.holder);
  return apiFetch(url);
};


export const getSupplyRisk = async (limit: number = 20): Promise<{ data: SupplyRisk[]; meta: { limit: number; total: number } }> => {
  const url = new URL(`${API_BASE_URL}/statistics/supply-risk`);
  url.searchParams.set('limit', limit.toString());
  return apiFetch(url);
};
