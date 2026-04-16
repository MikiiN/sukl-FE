import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { MedicationList } from './pages/MedicationList';
import { MedicationDetail } from './pages/MedicationDetail';
import { SubstanceList } from './pages/SubstanceList';
import { SubstanceDetail } from './pages/SubstanceDetail';
import { PharmacyList } from './pages/PharmacyList';
import { PharmacyDetail } from './pages/PharmacyDetail';
import { DisruptionList } from './pages/DisruptionList';
import { AtcBrowser } from './pages/AtcBrowser';
import { PrescriptionStats } from './pages/PrescriptionStats';
import { OrganizationList } from './pages/OrganizationList';
import { OrganizationDetail } from './pages/OrganizationDetail';
import { RegistrationChanges } from './pages/RegistrationChanges';
import { IntermediaryList } from './pages/IntermediaryList';
import { SupplyRiskStats } from './pages/SupplyRiskStats';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<MedicationList />} />
        <Route path="/substances" element={<SubstanceList />} />
        <Route path="/substances/:id" element={<SubstanceDetail />} />
        <Route path="/pharmacies" element={<PharmacyList />} />
        <Route path="/pharmacies/:id" element={<PharmacyDetail />} />
        <Route path="/disruptions" element={<DisruptionList />} />
        <Route path="/atc" element={<AtcBrowser />} />
        <Route path="/prescriptions" element={<PrescriptionStats />} />
        <Route path="/organizations" element={<OrganizationList />} />
        <Route path="/organizations/:code" element={<OrganizationDetail />} />
        <Route path="/registration-changes" element={<RegistrationChanges />} />
        <Route path="/intermediaries" element={<IntermediaryList />} />
        <Route path="/statistics" element={<SupplyRiskStats />} />
        <Route path="/:suklCode" element={<MedicationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
