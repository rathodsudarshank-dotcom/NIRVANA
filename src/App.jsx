import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SimulationProvider } from './context/SimulationContext';

import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Sensors from './pages/Sensors';
import Monitor from './pages/Monitor';
import AIAnalysis from './pages/AIAnalysis';
import Reports from './pages/Reports';
import Contact from './pages/Contact';

export default function App() {
  return (
    <SimulationProvider>
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
    </SimulationProvider>
  );
}
