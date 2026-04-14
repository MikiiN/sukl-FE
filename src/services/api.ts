import type { Medication } from '../types/medication';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_BASE_URL = 'http://localhost:3000';

export const getMedications = async (
  query: string = '', 
  page: number = 1, 
  limit: number = 21
): Promise<PaginatedResponse<Medication>> => {
  
  const url = new URL(`${API_BASE_URL}/medications`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('page', page.toString());
  
  if (query) {
    url.searchParams.append('name', query);
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Chyba při stahování dat z API');
  }

  return response.json();
};

export const getMedicationDetail = async (suklCode: string): Promise<Medication> => {
  const response = await fetch(`${API_BASE_URL}/medications/${suklCode}`);
  if (!response.ok) throw new Error('Detail léku nenalezen');
  const json = await response.json();
  return json;
};