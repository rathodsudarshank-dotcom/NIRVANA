import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApiStatusContext } from './context/SimulationContext';
import { SimulationProvider } from './context/SimulationProvider';

import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Sensors from './pages/Sensors';
import Monitor from './pages/Monitor';
import AIAnalysis from './pages/AIAnalysis';
import Reports from './pages/Reports';
import Contact from './pages/Contact';

function AppShell() {
  const { backendMode, apiLoading, apiError } = useApiStatusContext();

  return (
    <>
      {(apiLoading || backendMode === 'connected' || apiError) && (
        <div className={`app-mode-banner ${backendMode === 'connected' ? 'app-mode-banner--connected' : 'app-mode-banner--demo'}`}>
          <span className="app-mode-banner__status-dot" />
          {apiLoading ? 'Checking backend status…' : backendMode === 'connected' ? 'Connected mode: backend active' : null}
          {apiError && <span className="app-mode-banner__message">{apiError}</span>}
        </div>
      )}

      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppShell />
    </SimulationProvider>
  );
}
