import { useMemo } from 'react';
import { ApiStatusContext, SimulationContext } from './SimulationContext';
import { useSimulation } from '../hooks/useSimulation';

export function SimulationProvider({ children }) {
  const simulation = useSimulation();
  const apiStatus = useMemo(() => ({
    backendMode: simulation.backendMode,
    apiLoading: simulation.apiLoading,
    apiError: simulation.apiError,
  }), [simulation.backendMode, simulation.apiLoading, simulation.apiError]);

  return (
    <ApiStatusContext.Provider value={apiStatus}>
      <SimulationContext.Provider value={simulation}>
        {children}
      </SimulationContext.Provider>
    </ApiStatusContext.Provider>
  );
}