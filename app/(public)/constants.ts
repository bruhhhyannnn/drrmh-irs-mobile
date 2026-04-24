export type ReportType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  dimColor: string;
  iconShape: 'circle' | 'triangle' | 'diamond' | 'square';
};

export const REPORT_TYPES: ReportType[] = [
  {
    id: 'incident',
    title: 'Incident Report',
    subtitle: 'General emergency',
    description: 'Accidents, injuries, or any unexpected event that requires immediate attention.',
    accentColor: '#ef4444',
    dimColor: '#450a0a',
    iconShape: 'circle',
  },
//   {
//     id: 'mass-casualty',
//     title: 'Mass Casualty',
//     subtitle: 'Multiple persons affected',
//     description: 'Events involving multiple casualties requiring large-scale emergency response.',
//     accentColor: '#f97316',
//     dimColor: '#431407',
//     iconShape: 'triangle',
//   },
//   {
//     id: 'fire-hazard',
//     title: 'Fire / Hazard',
//     subtitle: 'Fire or chemical threat',
//     description: 'Active fires, chemical spills, or environmental hazards posing immediate risk.',
//     accentColor: '#eab308',
//     dimColor: '#422006',
//     iconShape: 'diamond',
//   },
];