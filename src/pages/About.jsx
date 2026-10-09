import ProblemSection from '../components/ProblemSection';
import Architecture from '../components/Architecture';
import WhyNirvana from '../components/WhyNirvana';
import PageLayout from '../components/PageLayout';

export default function About() {
  return (
    <PageLayout>
      <ProblemSection />
      <div className="section-divider" />
      <Architecture />
      <div className="section-divider" />
      <WhyNirvana />
    </PageLayout>
  );
}
