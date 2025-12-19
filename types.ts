
export enum PhaseType {
  G1 = 'G1',
  S = 'S',
  G2 = 'G2',
  PROPHASE = 'PRO',
  METAPHASE = 'MET',
  ANAPHASE = 'ANA',
  TELOPHASE = 'TEL',
  CYTOKINESIS = 'CYT',
  G0 = 'G0'
}

export interface PhaseInfo {
  type: PhaseType;
  name: string;
  description: string;
  sportsAnalogy: string;
  color: string;
  duration: string;
  keyProcess: string;
}

export interface ChartDataPoint {
  time: number;
  energy: number;
  dna: number;
  protein: number;
  phase: PhaseType;
}
