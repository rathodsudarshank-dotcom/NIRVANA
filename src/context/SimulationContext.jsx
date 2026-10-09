import { createContext, useContext } from 'react';

export const SimulationContext = createContext(null);
export const ApiStatusContext = createContext(null);

export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}

export function useApiStatusContext() {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error('useApiStatusContext must be used within a SimulationProvider');
  }
  return context;
}
