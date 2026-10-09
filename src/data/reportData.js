// ============================================================
// NIRVANA — Report Data & Structural Engineering Definitions
// Centralized definitions for anomaly reports, structural components,
// baseline comparisons, and export utilities.
// ============================================================

import { BRIDGE_INFO } from './bridgeData';

export const STRUCTURAL_COMPONENTS = {
  girder: {
    key: 'girder',
    name: 'Primary Longitudinal Box Girder (Girder G2)',
    shortName: 'Girder G2',
    category: 'Girder',
    locationRef: 'Mid-span, Girder G2 (Span 2, Chainage 210m)',
    material: 'High-Strength Structural Steel Grade S355 / Orthotropic Deck Stiffeners',
    structuralRole: 'Primary longitudinal load-bearing element resisting positive bending moments from live traffic and dead loads.',
    primarySensors: ['ACC-01', 'SG-01'],
    sensorsDetail: [
      { id: 'ACC-01', type: 'High-Precision MEMS Accelerometer', axis: 'Triaxial (Z-dominant)', range: '±2.0 g', sampling: '200 Hz', purpose: 'Dynamic flexural acceleration & resonance screening' },
      { id: 'SG-01', type: 'Foil Strain Gauge (Full Bridge)', axis: 'Longitudinal (Bottom Flange)', range: '±2000 µε', sampling: '50 Hz', purpose: 'Direct tensile strain & fatigue stress cycles' }
    ],
    designLimit: 'Max allowable strain: 500 µε | Max dynamic acceleration: 0.50 g',
    lastPhysicalInspection: '2026-09-15',
    conditionRating: 'Fair to Satisfactory (Baseline)'
  },
  expansion_joint: {
    key: 'expansion_joint',
    name: 'Modular Expansion Joint (Joint EJ-East)',
    shortName: 'Joint EJ-East',
    category: 'Expansion Joint',
    locationRef: 'East Abutment Transition, Chainage 380m',
    material: 'Multi-Girt High-Movement Elastomeric Seal & Steel Centerbeams',
    structuralRole: 'Accommodates longitudinal thermal expansion/contraction and dynamic displacement while maintaining roadway continuity.',
    primarySensors: ['LVDT-01'],
    sensorsDetail: [
      { id: 'LVDT-01', type: 'LVDT Linear Displacement Transducer', axis: 'Longitudinal Displacement', range: '0 – 150 mm', sampling: '20 Hz', purpose: 'Joint gap width & thermal displacement tracking' }
    ],
    designLimit: 'Max nominal gap displacement: ±25 mm',
    lastPhysicalInspection: '2026-08-04',
    conditionRating: 'Good'
  },
  pier: {
    key: 'pier',
    name: 'Reinforced Concrete Substructure (Pier P1)',
    shortName: 'Pier P1',
    category: 'Pier',
    locationRef: 'Western River Channel Substructure, Pier P1',
    material: 'Reinforced Cast-in-Place Concrete (Grade C45/55) on Bored Piles',
    structuralRole: 'Transfers superstructure dead and live loads to the deep pile foundation in the riverbed.',
    primarySensors: ['TILT-01'],
    sensorsDetail: [
      { id: 'TILT-01', type: 'Dual-Axis MEMS Tiltmeter', axis: 'Biaxial (Longitudinal/Transverse)', range: '±5.0°', sampling: '10 Hz', purpose: 'Substructure tilt, differential settlement & scour tilt' }
    ],
    designLimit: 'Max allowable service tilt: 0.25°',
    lastPhysicalInspection: '2026-08-20',
    conditionRating: 'Excellent'
  },
  cable: {
    key: 'cable',
    name: 'High-Tensile Parallel Strand Stay Cable (Stay SC-04)',
    shortName: 'Stay SC-04',
    category: 'Stay Cable',
    locationRef: 'Main Span North Stay Cable, Anchor Node N-4',
    material: 'Galvanized High-Tensile Steel Wire Strands (HDPE Sheathed, 1860 MPa)',
    structuralRole: 'Suspends the main span deck from the central pylon tower, transferring deck loads into axial tower compression.',
    primarySensors: ['ACC-01', 'CAM-01'],
    sensorsDetail: [
      { id: 'ACC-01', type: 'Cable-Vibration Accelerometer', axis: 'Transverse / Cross-Stay', range: '±5.0 g', sampling: '100 Hz', purpose: 'Cable tension estimation via natural frequency tracking' },
      { id: 'CAM-01', type: 'HD PTZ Optical Inspection Camera', axis: 'Visual / Optical', range: '4K Zoom', sampling: 'Continuous', purpose: 'Visual sheath degradation & damper check' }
    ],
    designLimit: 'Stay tension ratio: < 45% Guaranteed Ultimate Tensile Strength',
    lastPhysicalInspection: '2026-07-04',
    conditionRating: 'Good'
  },
  deck: {
    key: 'deck',
    name: 'Orthotropic Steel Deck Slab (Section D-03)',
    shortName: 'Deck Section D-03',
    category: 'Deck',
    locationRef: 'Mid-span Center Lane, Chainage 210m – 230m',
    material: 'Orthotropic Steel Plate Deck with Epoxy-Modified Asphalt Wearing Course',
    structuralRole: 'Directly supports wheel traffic and distributes concentrated wheel loads to the longitudinal girders.',
    primarySensors: ['TEMP-01', 'SG-01'],
    sensorsDetail: [
      { id: 'TEMP-01', type: 'Embedded 4-Wire RTD Platinum Sensor', axis: 'Thermal Gradient', range: '-40 – 80 °C', sampling: '1 Hz', purpose: 'Deck surface temperature & thermal stress compensation' },
      { id: 'SG-01', type: 'Foil Strain Gauge', axis: 'Longitudinal Ribs', range: '±1500 µε', sampling: '50 Hz', purpose: 'Rib-to-deck plate weld fatigue monitoring' }
    ],
    designLimit: 'Max permissible surface strain: 450 µε',
    lastPhysicalInspection: '2026-05-18',
    conditionRating: 'Good'
  },
  bearing: {
    key: 'bearing',
    name: 'Elastomeric Pot Bearing Assembly (Bearing B-02)',
    shortName: 'Bearing B-02',
    category: 'Bearing',
    locationRef: 'Pier P1 Top Cap / Superstructure Interface',
    material: 'Confined Elastomeric Disc with PTFE Sliding Surface and Stainless Steel Plate',
    structuralRole: 'Transfers vertical reactions to substructure while accommodating multi-directional rotations and longitudinal sliding.',
    primarySensors: ['LVDT-01', 'TILT-01'],
    sensorsDetail: [
      { id: 'LVDT-01', type: 'Bearing Displacement Transducer', axis: 'Longitudinal Slide', range: '±50 mm', sampling: '10 Hz', purpose: 'Sliding plate displacement & elastomeric shear strain' },
      { id: 'TILT-01', type: 'Inclinometer', axis: 'Rotational Angle', range: '±3.0°', sampling: '10 Hz', purpose: 'Rotational capacity verification under live loading' }
    ],
    designLimit: 'Max rotation: 0.02 rad | Max displacement: ±40 mm',
    lastPhysicalInspection: '2026-04-10',
    conditionRating: 'Good'
  }
};

// Initial realistic historical reports catalogue
export const INITIAL_REPORTS = [
  {
    id: 'REP-2026-0915-01',
    title: 'Routine Biannual Structural Health Audit',
    bridgeId: BRIDGE_INFO.id,
    bridgeName: BRIDGE_INFO.name,
    timestamp: '2026-09-15 10:14:00',
    isSimulated: false,
    componentKey: 'deck',
    component: STRUCTURAL_COMPONENTS.deck.name,
    componentShort: STRUCTURAL_COMPONENTS.deck.shortName,
    componentCategory: 'Deck',
    locationRef: STRUCTURAL_COMPONENTS.deck.locationRef,
    primarySensor: 'TEMP-01 & SG-01',
    sensorType: 'RTD Platinum Sensor & Foil Strain Gauge',
    riskLevel: 'LOW',
    healthScore: 82,
    severity: 'Normal (Nominal Baseline)',
    urgency: 'Routine — Next Scheduled Cycle (2027-03-15)',
    modelConfidence: 94,
    uncertainty: '±2.1%',
    alertTriggered: 'No thresholds breached. All parameters within 1.0σ baseline envelope.',
    readingsComparison: [
      { parameter: 'Vibration', sensorId: 'ACC-01', normal: '0.12 g', current: '0.12 g', delta: '0.00 g (0%)', limit: '0.25 g', status: 'Normal', isBreached: false },
      { parameter: 'Strain', sensorId: 'SG-01', normal: '145 µε', current: '142 µε', delta: '-3 µε (-2%)', limit: '280 µε', status: 'Normal', isBreached: false },
      { parameter: 'Deflection', sensorId: 'LVDT-01', normal: '2.3 mm', current: '2.2 mm', delta: '-0.1 mm (-4%)', limit: '6.0 mm', status: 'Normal', isBreached: false },
      { parameter: 'Tilt', sensorId: 'TILT-01', normal: '0.04°', current: '0.04°', delta: '0.00° (0%)', limit: '0.15°', status: 'Normal', isBreached: false },
      { parameter: 'Temperature', sensorId: 'TEMP-01', normal: '28.4 °C', current: '27.9 °C', delta: '-0.5 °C (-1.8%)', limit: '-20 – 60 °C', status: 'Normal', isBreached: false },
      { parameter: 'Humidity', sensorId: 'HUM-01', normal: '62%', current: '60%', delta: '-2% (-3.2%)', limit: '0 – 100%', status: 'Normal', isBreached: false }
    ],
    possibleCauses: [
      { title: 'Normal Operational Service', likelihood: 'Confirmed (98%)', evidence: 'Consistent traffic distribution and weather conditions.', description: 'Superstructure operating well within elastic design thresholds.' }
    ],
    recommendedActions: [
      { component: 'Deck Section D-03', action: 'Continue standard automated 24/7 telemetry acquisition.' },
      { component: 'Sensors Network', action: 'Maintain current zero-drift sensor filtering.' }
    ],
    engineeringInspectionRecommended: false,
    riskExplanation: 'All structural indicators are stable and track nominal seasonal baseline profiles.',
    decisionSupportNotice: 'NIRVANA continuous telemetry reflects nominal operational structural behavior.'
  },
  {
    id: 'REP-2026-0804-03',
    title: 'Thermal Articulation Variance — Expansion Joint EJ-East',
    bridgeId: BRIDGE_INFO.id,
    bridgeName: BRIDGE_INFO.name,
    timestamp: '2026-08-04 15:42:10',
    isSimulated: false,
    componentKey: 'expansion_joint',
    component: STRUCTURAL_COMPONENTS.expansion_joint.name,
    componentShort: STRUCTURAL_COMPONENTS.expansion_joint.shortName,
    componentCategory: 'Expansion Joint',
    locationRef: STRUCTURAL_COMPONENTS.expansion_joint.locationRef,
    primarySensor: 'LVDT-01',
    sensorType: 'LVDT Linear Displacement Transducer',
    riskLevel: 'MEDIUM',
    healthScore: 68,
    severity: 'Warning (Level 1 Alert)',
    urgency: 'Medium — Maintenance Assessment within 14 Days',
    modelConfidence: 89,
    uncertainty: '±3.4%',
    alertTriggered: 'Longitudinal displacement approached summer upper clearance margin (+18% variance).',
    readingsComparison: [
      { parameter: 'Vibration', sensorId: 'ACC-01', normal: '0.12 g', current: '0.15 g', delta: '+0.03 g (+25%)', limit: '0.25 g', status: 'Normal', isBreached: false },
      { parameter: 'Strain', sensorId: 'SG-01', normal: '145 µε', current: '168 µε', delta: '+23 µε (+16%)', limit: '280 µε', status: 'Normal', isBreached: false },
      { parameter: 'Deflection', sensorId: 'LVDT-01', normal: '2.3 mm', current: '5.4 mm', delta: '+3.1 mm (+135%)', limit: '6.0 mm', status: 'Warning', isBreached: true },
      { parameter: 'Tilt', sensorId: 'TILT-01', normal: '0.04°', current: '0.07°', delta: '+0.03° (+75%)', limit: '0.15°', status: 'Normal', isBreached: false },
      { parameter: 'Temperature', sensorId: 'TEMP-01', normal: '28.4 °C', current: '36.8 °C', delta: '+8.4 °C (+29.6%)', limit: '-20 – 60 °C', status: 'Elevated (Thermal)', isBreached: false },
      { parameter: 'Humidity', sensorId: 'HUM-01', normal: '62%', current: '48%', delta: '-14% (-22.6%)', limit: '0 – 100%', status: 'Normal', isBreached: false }
    ],
    possibleCauses: [
      { title: 'Thermal Expansion Superposition', likelihood: 'Likely (80%)', evidence: 'Ambient deck temperature exceeded 36.8 °C during peak solar radiation.', description: 'Thermal expansion of the 420m superstructure reduced nominal joint expansion gap.' },
      { title: 'Debris Ingress in Girt Cavity', likelihood: 'Possible (35%)', evidence: 'Slight non-linear resistance during peak afternoon contraction cycle.', description: 'Grit or road dust may partially restrict multi-seal sliding plates.' }
    ],
    recommendedActions: [
      { component: 'Joint EJ-East', action: 'Inspect elastomeric seal trough for road grit and clear debris accumulated in sliding cavities.' },
      { component: 'LVDT-01 Sensor', action: 'Verify transducer rod alignment and clean protective rubber boot.' }
    ],
    engineeringInspectionRecommended: false,
    riskExplanation: 'Displacement approached seasonal high thresholds driven primarily by elevated ambient summer temperatures.',
    decisionSupportNotice: 'Advisory notice: Structural movement remains within permissible elastomeric expansion joint service limits.'
  },
  {
    id: 'REP-2026-0712-02',
    title: 'High-Wind Dynamic Aerodynamic Baseline Check',
    bridgeId: BRIDGE_INFO.id,
    bridgeName: BRIDGE_INFO.name,
    timestamp: '2026-07-12 18:20:45',
    isSimulated: false,
    componentKey: 'cable',
    component: STRUCTURAL_COMPONENTS.cable.name,
    componentShort: STRUCTURAL_COMPONENTS.cable.shortName,
    componentCategory: 'Stay Cable',
    locationRef: STRUCTURAL_COMPONENTS.cable.locationRef,
    primarySensor: 'ACC-01 & CAM-01',
    sensorType: 'Accelerometer & Optical PTZ Camera',
    riskLevel: 'LOW',
    healthScore: 84,
    severity: 'Normal (Aerodynamic Check)',
    urgency: 'Routine — Monitor upcoming storm front',
    modelConfidence: 92,
    uncertainty: '±2.5%',
    alertTriggered: 'Transient cross-wind vortex shedding within normal aerodynamic damping margins.',
    readingsComparison: [
      { parameter: 'Vibration', sensorId: 'ACC-01', normal: '0.12 g', current: '0.18 g', delta: '+0.06 g (+50%)', limit: '0.25 g', status: 'Normal', isBreached: false },
      { parameter: 'Strain', sensorId: 'SG-01', normal: '145 µε', current: '155 µε', delta: '+10 µε (+7%)', limit: '280 µε', status: 'Normal', isBreached: false },
      { parameter: 'Deflection', sensorId: 'LVDT-01', normal: '2.3 mm', current: '3.1 mm', delta: '+0.8 mm (+35%)', limit: '6.0 mm', status: 'Normal', isBreached: false },
      { parameter: 'Tilt', sensorId: 'TILT-01', normal: '0.04°', current: '0.05°', delta: '+0.01° (+25%)', limit: '0.15°', status: 'Normal', isBreached: false },
      { parameter: 'Temperature', sensorId: 'TEMP-01', normal: '28.4 °C', current: '24.1 °C', delta: '-4.3 °C (-15.1%)', limit: '-20 – 60 °C', status: 'Normal', isBreached: false },
      { parameter: 'Humidity', sensorId: 'HUM-01', normal: '62%', current: '71%', delta: '+9% (+14.5%)', limit: '0 – 100%', status: 'Normal', isBreached: false }
    ],
    possibleCauses: [
      { title: 'Cross-Wind Aerodynamic Buffeting', likelihood: 'Likely (85%)', evidence: 'Anemometer recorded sustained 48 km/h gusts at tower deck elevation.', description: 'Stay cable internal hydraulic dampers absorbed modal oscillations with 1.8% critical damping.' }
    ],
    recommendedActions: [
      { component: 'Stay Cable SC-04', action: 'Review damping ratio from free-decay vibration records.' },
      { component: 'CAM-01 Camera', action: 'Visual sweep of guide vane dampers and neoprene collars.' }
    ],
    engineeringInspectionRecommended: false,
    riskExplanation: 'Cable aerodynamic oscillations were fully attenuated by stay damping hardware.',
    decisionSupportNotice: 'NIRVANA telemetry confirms stay cable vibration within aeroelastic damping specifications.'
  }
];

// Factory to create a simulated anomaly report based on live state
export function createSimulatedAnomalyReport(timestamp, bridgeState = {}, aiState = {}) {
  const comp = STRUCTURAL_COMPONENTS.girder;
  const vibVal = bridgeState.vibration?.value ?? 0.41;
  const strVal = bridgeState.strain?.value ?? 387;
  const defVal = bridgeState.deflection?.value ?? 8.7;
  const tiltVal = bridgeState.tilt?.value ?? 0.19;
  const tempVal = bridgeState.temperature?.value ?? 29.1;
  const humVal = bridgeState.humidity?.value ?? 64;

  const vibDelta = parseFloat((vibVal - 0.12).toFixed(2));
  const strDelta = Math.round(strVal - 145);
  const defDelta = parseFloat((defVal - 2.3).toFixed(1));

  return {
    id: `REP-SIM-${new Date().getTime().toString().slice(-4)}`,
    title: 'Simulated Dynamic Overload & Flexural Strain Spike — Girder G2',
    bridgeId: BRIDGE_INFO.id,
    bridgeName: BRIDGE_INFO.name,
    timestamp: timestamp || new Date().toISOString().slice(0, 19).replace('T', ' '),
    isSimulated: true,
    componentKey: 'girder',
    component: comp.name,
    componentShort: comp.shortName,
    componentCategory: 'Girder',
    locationRef: comp.locationRef,
    primarySensor: 'ACC-01 & SG-01',
    sensorType: 'MEMS Accelerometer (ACC-01) & Foil Strain Gauge (SG-01)',
    riskLevel: 'HIGH',
    healthScore: bridgeState.healthScore ?? 34,
    severity: 'Critical (Level 2 Alert)',
    urgency: 'Immediate — Qualified Structural Engineering Review within 24 Hours',
    modelConfidence: aiState.confidence ?? 91,
    uncertainty: '±4.2%',
    alertTriggered: 'Alert Triggered: Vibration (0.41 g, +242%) and Strain (387 µε, +167%) simultaneously breached Level 2 operational thresholds (0.25 g / 280 µε). Correlated with +6.4 mm deflection drift at LVDT-01.',
    readingsComparison: [
      {
        parameter: 'Vibration',
        sensorId: 'ACC-01',
        normal: '0.12 g',
        current: `${vibVal} g`,
        delta: `+${vibDelta} g (+${Math.round((vibDelta / 0.12) * 100)}%)`,
        limit: '0.25 g',
        status: 'Elevated',
        isBreached: true,
        unit: 'g'
      },
      {
        parameter: 'Strain',
        sensorId: 'SG-01',
        normal: '145 µε',
        current: `${strVal} µε`,
        delta: `+${strDelta} µε (+${Math.round((strDelta / 145) * 100)}%)`,
        limit: '280 µε',
        status: 'Elevated',
        isBreached: true,
        unit: 'µε'
      },
      {
        parameter: 'Deflection',
        sensorId: 'LVDT-01',
        normal: '2.3 mm',
        current: `${defVal} mm`,
        delta: `+${defDelta} mm (+${Math.round((defDelta / 2.3) * 100)}%)`,
        limit: '6.0 mm',
        status: 'Elevated',
        isBreached: true,
        unit: 'mm'
      },
      {
        parameter: 'Tilt',
        sensorId: 'TILT-01',
        normal: '0.04°',
        current: `${tiltVal}°`,
        delta: `+${(tiltVal - 0.04).toFixed(2)}° (+${Math.round(((tiltVal - 0.04) / 0.04) * 100)}%)`,
        limit: '0.15°',
        status: 'Warning',
        isBreached: true,
        unit: '°'
      },
      {
        parameter: 'Temperature',
        sensorId: 'TEMP-01',
        normal: '28.4 °C',
        current: `${tempVal} °C`,
        delta: `+${(tempVal - 28.4).toFixed(1)} °C (+2.5%)`,
        limit: '-20 – 60 °C',
        status: 'Normal',
        isBreached: false,
        unit: '°C'
      },
      {
        parameter: 'Humidity',
        sensorId: 'HUM-01',
        normal: '62%',
        current: `${humVal}%`,
        delta: `+${humVal - 62}% (+3.2%)`,
        limit: '0 – 100%',
        status: 'Normal',
        isBreached: false,
        unit: '%'
      }
    ],
    possibleCauses: [
      {
        title: 'Increased Loading or Unusual Vehicle Movement',
        likelihood: 'Moderate (Estimated Likelihood: 65%)',
        evidence: 'Synchronous strain spike at SG-01 (+167%) coinciding with peak acceleration window.',
        description: 'Possible transit of an unpermitted heavy multi-axle freight convoy or localized bunching of heavy commercial vehicles creating dynamic impact amplification.'
      },
      {
        title: 'Unexpected Vibration Patterns & Dynamic Excitation',
        likelihood: 'Plausible (Estimated Likelihood: 70%)',
        evidence: 'Broadband vibration rise with sharp spectral peak at 3.2 Hz registered by ACC-01.',
        description: 'Transverse wind-buffeting or vortex shedding aligning with bridge natural flexural harmonic mode, temporarily driving resonant vibration amplification.'
      },
      {
        title: 'Possible Structural Movement or Bearing Binding',
        likelihood: 'Low to Moderate (Estimated Likelihood: 40%)',
        evidence: 'Deflection increase of +6.4 mm accompanied by minor tilt displacement (+0.15°).',
        description: 'Potential elastomeric bearing distortion or temporary thermal constraint at expansion joint sliding plates under live traffic loading.'
      },
      {
        title: 'Potential Sensor Malfunction or Noisy Readings',
        likelihood: 'Low Probability (Estimated Likelihood: 15%)',
        evidence: 'High signal coherence observed across multiple distinct sensor types (ACC-01, SG-01, and LVDT-01).',
        description: 'Standalone sensor fault is considered unlikely due to simultaneous cross-sensor physical correlation. However, cable noise or ground-loop transients should still be verified during site check.'
      }
    ],
    recommendedActions: [
      {
        component: 'Primary Girder G2 (Vibration / ACC-01)',
        action: 'Extract continuous 200 Hz raw vibration time-series; compute Fast Fourier Transform (FFT) power spectral density to check modal damping decay. Correlate timestamp with traffic management Weigh-In-Motion (WIM) logs.'
      },
      {
        component: 'Girder G2 Bottom Flange (Strain / SG-01)',
        action: 'Perform on-site zero-datum calibration check. Conduct non-destructive ultrasonic and magnetic particle testing on bottom flange tension zone and transverse stiffener welds for micro-fatigue cracking.'
      },
      {
        component: 'Expansion Joint EJ-East & Bearings (Deflection / LVDT-01)',
        action: 'Verify physical mechanical alignment of displacement transducer linkage. Inspect expansion joint gap clearance under ambient temperature variations and check elastomeric bearing pad shear deformation.'
      },
      {
        component: 'Sensor Wiring & Telemetry Quality Assurance',
        action: 'Inspect physical sensor cabling harness, junction box JB-02 moisture seals, grounding resistance, and verify signal-to-noise ratio using portable calibration test unit.'
      }
    ],
    engineeringInspectionRecommended: true,
    riskExplanation: 'Risk escalated from LOW to HIGH because multiple independent structural sensors breached Level-2 warning thresholds simultaneously, indicating localized dynamic bending stress rather than benign ambient environmental fluctuations.',
    decisionSupportNotice: 'Advisory Notice: NIRVANA provides diagnostic telemetry and predictive screening for structural health monitoring. It does NOT predict the exact time of structural failure. Decisions regarding structural repairs, component replacement, speed limits, or bridge closure strictly require qualified on-site assessment by a licensed Professional Structural Engineer.'
  };
}

// Utility to export a report as formatted CSV
export function exportReportToCSV(report) {
  if (!report) return;

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines = [
    ['NIRVANA STRUCTURAL HEALTH MONITORING REPORT'],
    ['Report ID', report.id],
    ['Report Title', report.title],
    ['Bridge ID', report.bridgeId],
    ['Bridge Name', report.bridgeName],
    ['Timestamp', report.timestamp],
    ['Classification', report.isSimulated ? 'SIMULATED ANOMALY EVENT (DEMO DATA)' : 'OFFICIAL HISTORICAL AUDIT'],
    ['Structural Component', report.component],
    ['Component Category', report.componentCategory],
    ['Location Reference', report.locationRef],
    ['Primary Sensors', report.primarySensor],
    ['Sensor Type', report.sensorType],
    ['Risk Level', report.riskLevel],
    ['Health Score', `${report.healthScore} / 100`],
    ['Anomaly Severity', report.severity],
    ['Recommended Urgency', report.urgency],
    ['AI Model Confidence', `${report.modelConfidence}%`],
    ['Model Uncertainty', report.uncertainty],
    ['Engineering Inspection Status', report.engineeringInspectionRecommended ? 'ENGINEERING INSPECTION RECOMMENDED' : 'ROUTINE MONITORING'],
    [],
    ['WHAT CHANGED — PARAMETER COMPARISON'],
    ['Parameter', 'Sensor ID', 'Baseline (Normal)', 'Observed Reading', 'Variance / Delta', 'Safety Threshold', 'Status'],
    ...report.readingsComparison.map(r => [
      r.parameter,
      r.sensorId,
      r.normal,
      r.current,
      r.delta,
      r.limit,
      r.status
    ]),
    [],
    ['ALERT TRIGGER DETAILS'],
    ['Explanation', report.alertTriggered],
    [],
    ['POSSIBLE CAUSES (PLAUSIBLE ENGINEERING HYPOTHESES)'],
    ['Hypothesis', 'Estimated Likelihood', 'Observed Evidence', 'Engineering Description'],
    ...report.possibleCauses.map(c => [
      c.title,
      c.likelihood,
      c.evidence,
      c.description
    ]),
    [],
    ['RECOMMENDED ACTIONS'],
    ['Target Component', 'Recommended Practical Action'],
    ...report.recommendedActions.map(a => [
      a.component,
      a.action
    ]),
    [],
    ['DECISION SUPPORT & SAFETY ADVISORY'],
    ['Safety Notice', report.decisionSupportNotice]
  ];

  const csvContent = lines.map(row => row.map(escapeCSV).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NIRVANA_Report_${report.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
