import type { Medication } from '../types';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PharmaceuticalForm {
  code: string;
  name: string;
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

export const getPharmaceuticalForms = async (): Promise<PharmaceuticalForm[]> => {
  const response = await fetch(`${API_BASE_URL}/meta/pharmaceutical-forms`);
  
  if (!response.ok) {
    throw new Error('Chyba při načítání číselníku forem');
  }

  const json = await response.json();
  return json.data;
};