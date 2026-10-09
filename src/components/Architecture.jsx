import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';

const ARCH_NODES = [
  { title: 'Bridge Sensors', desc: 'Accelerometers, strain gauges, displacement, tilt, temperature' },
  { title: 'Edge Device / Gateway', desc: 'ESP32 / Raspberry Pi — local pre-processing' },
  { title: 'Network', desc: 'Wi-Fi / 4G / LoRa / Ethernet' },
  { title: 'Cloud Backend', desc: 'Azure IoT Hub / Azure Functions' },
  { title: 'Database', desc: 'Azure Cosmos DB / Time-Series Storage' },
  { title: 'AI Analytics', desc: 'Azure ML / Custom Neural Networks' },
  { title: 'NIRVANA Dashboard', desc: 'Real-time visualization & alerts' },
];

export default function Architecture() {
  const headingRef = useScrollReveal();
  const setRef = useStaggerReveal(ARCH_NODES.length, 80);

  return (
    <section className="section">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">System Architecture</div>
          <h2 className="section__title">End-to-End Data Flow</h2>
          <p className="section__subtitle">
            From physical sensors on the bridge to the AI-powered dashboard —
            a complete data pipeline for infrastructure monitoring.
          </p>
        </div>

        <div className="arch__flow">
          {ARCH_NODES.map((node, i) => (
            <div key={i}>
              <div className="arch__node reveal" ref={setRef(i)}>
                <div className="arch__node-title">{node.title}</div>
                <div className="arch__node-desc">{node.desc}</div>
              </div>
              {i < ARCH_NODES.length - 1 && (
                <div className="arch__connector" aria-hidden="true">
                  <div className="arch__connector-line" />
                  <div className="arch__connector-dot" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
