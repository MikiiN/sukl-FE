import { useEffect, useState } from 'react';
import './App.css';
import { MedicationCard } from './components/MedicationCard';
import type { Medication } from './types';
import { Pagination } from './components/Pagination';
import { getMedications, getPharmaceuticalForms } from './services/api';


function App() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [formsMap, setFormsMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadForms = async () => {
      try {
        const forms = await getPharmaceuticalForms();
        const map: Record<string, string> = {};
        
        forms.forEach((form) => {
          map[form.code] = form.name;
        });
        
        setFormsMap(map);
      } catch (err) {
        console.error('Chyba při načítání forem:', err);
      }
    };

    loadForms();
  }, []);

  const loadMedications = async (query: string, pageNumber: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMedications(query, pageNumber);
      
      setMedications(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError('Nepodařilo se načíst data z API.');
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadMedications(searchInput, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePrevPage = () => {
    const newPage = Math.max(page - 1, 1)
    setPage(newPage)
    loadMedications(searchInput, newPage)
  }

  const handleNextPage = () => {
    const newPage = Math.min(page + 1, totalPages)
    setPage(newPage)
    loadMedications(searchInput, newPage)
  }

  return (
    <div className="app-container">
      <h1 className="app-header">Katalog léčiv</h1>
      
      <div className="search-form">
        <input 
          type="text" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Začněte psát název léku (např. Ibalgin)..."
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {isLoading && medications.length === 0 && !error && (
        <div className="status-message">Načítám data z API...</div>
      )}

      {medications.length > 0 && (
        <div className={isLoading ? 'loading-state' : ''}>
          <ul className="medication-grid">
            {medications.map((med) => (
              <MedicationCard 
                key={med.suklCode} 
                medication={med} 
                formName={formsMap[med.formCode || ''] || med.formCode}
              />
            ))}
          </ul>

          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}

      {!isLoading && medications.length === 0 && !error && (
        <div className="status-message">Žádné léky nebyly nalezeny.</div>
      )}
    </div>
  );
}

export default App;