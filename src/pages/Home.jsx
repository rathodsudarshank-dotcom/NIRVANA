import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import Workflow from '../components/Workflow';
import WhyNirvana from '../components/WhyNirvana';
import CTASection from '../components/CTASection';
import PageLayout from '../components/PageLayout';
import { useSimulationContext } from '../context/SimulationContext';

export default function Home() {
  const { bridgeState } = useSimulationContext();

  return (
    <PageLayout>
      <Hero bridgeState={bridgeState} />
      <div className="section-divider" />
      <ProblemSection />
      <div className="section-divider" />
      <Workflow />
      <div className="section-divider" />
      <WhyNirvana />
      <div className="section-divider" />
      <CTASection />
    </PageLayout>
  );
}
