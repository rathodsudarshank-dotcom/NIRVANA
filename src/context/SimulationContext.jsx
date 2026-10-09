import { createContext, useContext } from 'react';
import { useSimulation } from '../hooks/useSimulation';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const simulation = useSimulation();

  return (
    <SimulationContext.Provider value={simulation}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
