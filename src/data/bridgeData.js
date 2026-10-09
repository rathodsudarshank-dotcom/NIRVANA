// ============================================================
// NIRVANA — Centralized Bridge Data
// All dashboard components consume from this single source
// ============================================================

export const BRIDGE_INFO = {
  id: 'B-27',
  name: 'Riverside Bridge',
  type: 'Cable-Stayed Bridge',
  location: '34.0522° N, 118.2437° W',
  span: '420 m',
  built: 2018,
  lastInspection: '2026-09-15',
  status: 'ONLINE',
};

export const NORMAL_STATE = {
  vibration: { value: 0.12, unit: 'g', trend: -12, range: '0.00 – 0.50 g' },
  strain: { value: 145, unit: 'µε', trend: -8, range: '0 – 500 µε' },
  deflection: { value: 2.3, unit: 'mm', trend: -10, range: '0.0 – 15.0 mm' },
  tilt: { value: 0.04, unit: '°', trend: -3, range: '0.00 – 0.50°' },
  temperature: { value: 28.4, unit: '°C', trend: -2, range: '-20 – 60 °C' },
  humidity: { value: 62, unit: '%', trend: -5, range: '0 – 100%' },
  healthScore: 82,
  risk: 'LOW',
  riskPercent: 12,
};

export const ANOMALY_STATE = {
  vibration: { value: 0.41, unit: 'g', trend: 32, range: '0.00 – 0.50 g' },
  strain: { value: 387, unit: 'µε', trend: 21, range: '0 – 500 µε' },
  deflection: { value: 8.7, unit: 'mm', trend: 18, range: '0.0 – 15.0 mm' },
  tilt: { value: 0.19, unit: '°', trend: 14, range: '0.00 – 0.50°' },
  temperature: { value: 29.1, unit: '°C', trend: 1, range: '-20 – 60 °C' },
  humidity: { value: 64, unit: '%', trend: 2, range: '0 – 100%' },
  healthScore: 34,
  risk: 'HIGH',
  riskPercent: 78,
};

export const SENSORS = [
  {
    id: 'ACC-01',
    type: 'MEMS Accelerometer',
    shortType: 'VIBRATION',
    measures: 'Bridge vibration / acceleration',
    location: 'Deck mid-span girder',
    purpose: 'Detect abnormal dynamic behavior and resonance',
    icon: '📐',
    dataKey: 'vibration',
    position: { top: '58%', left: '52%' },
  },
  {
    id: 'SG-01',
    type: 'Foil Strain Gauge',
    shortType: 'STRUCTURAL STRAIN',
    measures: 'Structural strain / stress',
    location: 'Primary girder flange',
    purpose: 'Monitor load distribution and fatigue',
    icon: '📊',
    dataKey: 'strain',
    position: { top: '58%', left: '65%' },
  },
  {
    id: 'LVDT-01',
    type: 'LVDT Displacement Sensor',
    shortType: 'DEFLECTION',
    measures: 'Vertical displacement / deflection',
    location: 'Expansion joint — mid-span',
    purpose: 'Track structural deformation under load',
    icon: '📏',
    dataKey: 'deflection',
    position: { top: '58%', left: '30%' },
  },
  {
    id: 'TILT-01',
    type: 'MEMS Tiltmeter',
    shortType: 'INCLINATION',
    measures: 'Angular inclination',
    location: 'Pier / abutment base',
    purpose: 'Detect foundation movement or settlement',
    icon: '⚖️',
    dataKey: 'tilt',
    position: { top: '61%', left: '50%' },
  },
  {
    id: 'TEMP-01',
    type: 'RTD Temperature Sensor',
    shortType: 'TEMPERATURE',
    measures: 'Ambient & structural temperature',
    location: 'Deck surface / girder',
    purpose: 'Monitor thermal effects on structure',
    icon: '🌡️',
    dataKey: 'temperature',
    position: { top: '58%', left: '75%' },
  },
  {
    id: 'CAM-01',
    type: 'HD Inspection Camera',
    shortType: 'VISUAL INSPECTION',
    measures: 'Visual surface condition',
    location: 'Elevated tower position',
    purpose: 'AI-powered crack and damage detection',
    icon: '📷',
    dataKey: null,
    position: { top: '44%', left: '50%' },
    isCamera: true,
  },
];

export const AI_NORMAL = {
  risk: 'LOW',
  confidence: 94,
  findings: [
    { status: 'ok', text: 'Vibration within baseline parameters' },
    { status: 'ok', text: 'Strain within expected operational range' },
    { status: 'ok', text: 'Displacement stable — no drift detected' },
    { status: 'ok', text: 'No visible structural damage detected' },
    { status: 'ok', text: 'Environmental conditions within normal range' },
  ],
  recommendation: 'Continue routine monitoring. Next scheduled inspection: 2026-11-15.',
};

export const AI_ANOMALY = {
  risk: 'HIGH',
  confidence: 91,
  findings: [
    { status: 'critical', text: 'Vibration exceeded baseline by 32%' },
    { status: 'critical', text: 'Structural strain increased significantly (+21%)' },
    { status: 'warning', text: 'Displacement drift detected (+18%)' },
    { status: 'warning', text: 'Multiple correlated anomalies across sensors' },
    { status: 'ok', text: 'Environmental conditions within normal range' },
  ],
  recommendation: 'Inspection Required. Abnormal vibration and increased structural strain detected relative to established baseline. Prioritize on-site structural assessment.',
};

export const WORKFLOW_STEPS = [
  {
    id: 'sensors',
    label: 'Sensors',
    description: 'Accelerometers, strain gauges, displacement sensors, tiltmeters, and environmental monitors continuously capture structural data.',
  },
  {
    id: 'camera',
    label: 'Computer Vision',
    description: 'HD cameras feed images to AI models that detect surface cracks, spalling, corrosion, and other visible anomalies.',
  },
  {
    id: 'edge',
    label: 'Edge & Cloud',
    description: 'Edge devices pre-process and transmit data to the cloud pipeline for storage, aggregation, and real-time analysis.',
  },
  {
    id: 'ai',
    label: 'AI Analytics',
    description: 'Neural networks perform time-series anomaly detection, sensor fusion, and multimodal risk assessment across all data sources.',
  },
  {
    id: 'risk',
    label: 'Risk Score',
    description: 'An interpretable health score and risk level are generated with full explainability — showing which factors contributed.',
  },
];

export const PROBLEM_CARDS = [
  {
    title: 'Fragmented Data',
    description: 'Sensor readings, inspection reports, and maintenance records exist in isolated systems — making holistic assessment difficult.',
    icon: 'fragments',
  },
  {
    title: 'Delayed Inspections',
    description: 'Scheduled inspections may miss rapidly developing structural issues between assessment cycles.',
    icon: 'clock',
  },
  {
    title: 'Hidden Risks',
    description: 'Gradual degradation can remain undetected until multiple failure indicators converge — often too late.',
    icon: 'warning',
  },
  {
    title: 'High Consequences',
    description: 'Infrastructure failure carries severe safety, economic, and societal consequences that demand proactive monitoring.',
    icon: 'alert',
  },
];

export const WHY_PILLARS = [
  {
    title: 'Predictive',
    description: 'Identify anomalies before they become critical through continuous AI-driven monitoring and trend analysis.',
    icon: 'predict',
  },
  {
    title: 'Multimodal',
    description: 'Combine structural sensor data, computer vision, and environmental information for comprehensive risk assessment.',
    icon: 'multimodal',
  },
  {
    title: 'Explainable',
    description: 'Every risk score comes with a clear breakdown of contributing factors — never a black box.',
    icon: 'explain',
  },
  {
    title: 'Scalable',
    description: 'Architecture designed to expand from a single bridge to entire infrastructure networks across regions.',
    icon: 'scale',
  },
];

export const AI_MODELS = [
  {
    name: 'Computer Vision',
    description: 'CNN-based object detection identifies visible cracks, spalling, corrosion, and surface damage from camera feeds.',
    tech: 'CNN / Object Detection',
  },
  {
    name: 'Time-Series Anomaly',
    description: 'Recurrent neural networks detect unusual vibration, strain, and displacement patterns against learned baselines.',
    tech: 'LSTM / Autoencoder',
  },
  {
    name: 'Sensor Fusion',
    description: 'Multimodal model combines signals from all sensor types to identify correlated anomalies across data sources.',
    tech: 'Multimodal Fusion',
  },
  {
    name: 'Risk Engine',
    description: 'Ensemble model produces an interpretable risk assessment with factor-level explainability and confidence scores.',
    tech: 'Ensemble / XAI',
  },
];
