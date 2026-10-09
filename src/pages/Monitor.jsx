import BridgeMonitor from '../components/BridgeMonitor';
import Dashboard from '../components/Dashboard';
import PageLayout from '../components/PageLayout';
import { useSimulationContext } from '../context/SimulationContext';

export default function Monitor() {
  const {
    isAnomaly,
    isTransitioning,
    bridgeState,
    aiState,
    simulateAnomaly,
    resetSimulation,
  } = useSimulationContext();

  return (
    <PageLayout>
      <div className="monitor-viewport">
        <div className="monitor-viewport__left">
          <BridgeMonitor bridgeState={bridgeState} isAnomaly={isAnomaly} compact={true} />
        </div>
        <div className="monitor-viewport__right">
          <Dashboard
            bridgeState={bridgeState}
            aiState={aiState}
            isAnomaly={isAnomaly}
            isTransitioning={isTransitioning}
            simulateAnomaly={simulateAnomaly}
            resetSimulation={resetSimulation}
            compact={true}
          />
        </div>
      </div>
    </PageLayout>
  );
}
