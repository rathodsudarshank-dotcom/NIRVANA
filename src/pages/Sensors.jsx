import SensorNetwork from '../components/SensorNetwork';
import BridgeMonitor from '../components/BridgeMonitor';
import PageLayout from '../components/PageLayout';
import { useSimulationContext } from '../context/SimulationContext';

export default function Sensors() {
  const { bridgeState, isAnomaly } = useSimulationContext();

  return (
    <PageLayout>
      <SensorNetwork />
      <div className="section-divider" />
      <BridgeMonitor bridgeState={bridgeState} isAnomaly={isAnomaly} />
    </PageLayout>
  );
}
