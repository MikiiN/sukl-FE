import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MedicationList } from './pages/MedicationList';
import { MedicationDetail } from './pages/MedicationDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedicationList />} />
        
        <Route path="/:suklCode" element={<MedicationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;