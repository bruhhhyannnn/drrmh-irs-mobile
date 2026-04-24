export const CLUSTERS = ['Pedro Gil', 'Padre Faura', 'Taft', 'SHS', 'PGH'] as const;

export type Cluster = (typeof CLUSTERS)[number];

export const UNITS: Record<Cluster, string[]> = {
  'Pedro Gil': [
    'College of Nursing',
    'College of Dentistry',
    'College of Pharmacy',
    'UP Manila Phi House Dormitory',
    'National Institutes of Health',
    'UP Manila Dorm',
    'College of Allied Medical Professions',
    'College of Public Health',
    'College of Medicine',
    'Sports Science and Wellness Center',
  ],
  'Padre Faura': [
    'College of Arts and Sciences',
    'Student Center',
    'Joaquin Gonzales Building',
    'Museum',
    'IMS Building',
    'Campus Planning, Development, and Management Office',
  ],
  Taft: ['Central Administration (CAD)', 'Faculty of Medical Arts Building'],
  SHS: ['Palo', 'Baler', 'Koronadal', 'Tarlac'],
  PGH: [
    'Zone 1',
    'Zone 2',
    'Zone 3',
    'Zone 4',
    'Zone 5',
    'Zone 6',
    'Zone 7',
    'Zone 8',
    'Zone 9',
    'Zone 10',
    'Zone 11',
    'Zone 12',
  ],
};

export const LOCATIONS: Record<Cluster, string[]> = {
  'Pedro Gil': [
    'Sotejo Hall',
    'NIH Building',
    'College of Nursing Building',
    'College of Pharmacy Building',
    'College of Dentistry Building',
    'College of Allied Medical Professions Building',
    'College of Public Health Building',
    'College of Medicine Building',
    'New Gold Bond Building',
    'Sports Science and Wellness Center',
    'UP Manila Phi House Dormitory',
    'UP Manila Dormitory',
    'Calderon Hall',
    'Salcedo Hall',
    'MSB Building',
    'Alvior Hall',
    'CAMP Building',
    'Joaquin Gonzales Main Building',
    'Joaquin Gonzales Annex Building',
  ],
  'Padre Faura': [
    'Rizal Hall',
    'GAB Building',
    'Student Center',
    'IMS Building',
    'Museum Building',
    'Paz Mendoza Building',
    'Dela Paz Building',
  ],
  Taft: [
    'Central Administration Building',
    'Faculty of Medical Arts Building',
    'ITC Building',
    'CPH Annex I',
    'CPH Annex II',
  ],
  SHS: ['Palo Campus', 'Baler Campus', 'Koronadal Campus', 'Tarlac Campus'],
  PGH: [
    'PGH Central Block',
    'PGH Zone 1',
    'PGH Zone 2',
    'PGH Zone 3',
    'PGH Zone 4',
    'PGH Zone 5',
    'PGH Zone 6',
  ],
};

export const POSITIONS = [
  // From the form dropdown
  'Head of Unit',
  'Head of Department',
  'Manager',
  // Administrative series
  'Administrative Aide I',
  'Administrative Aide II',
  'Administrative Aide III',
  'Administrative Aide IV',
  'Administrative Aide V',
  'Administrative Aide VI',
  'Administrative Assistant I',
  'Administrative Assistant II',
  'Administrative Assistant III',
  'Administrative Assistant IV',
  'Administrative Assistant V',
  'Administrative Officer I',
  'Administrative Officer II',
  'Administrative Officer III',
  'Administrative Officer IV',
  'Administrative Officer V',
  'Supervising Administrative Officer',
  // ERT roles
  'Incident Commander',
  'Liaison Officer',
  'Safety Officer',
  'Safety and Security Officer',
  'Health and Safety Officer',
  'Public Information Officer',
  'Marshall',
  'Floor Warden',
  'Evacuation Coordinator',
  'First Responder',
  'First Aider',
  'Search and Rescue Team Leader',
  'Search and Rescue Member',
  'Medical Team Leader',
  'Medical Team Member',
  'Communications Team Leader',
  'Communications Team Member',
  'Fire Marshal',
  // Technical / other staff
  'Laboratory Technician I',
  'Laboratory Technician II',
  'Laboratory Technician III',
  'Computer Programmer I',
  'Computer Programmer II',
  'Computer Programmer III',
  'Dormitory Manager I',
  'Dormitory Manager II',
  'Dormitory Manager III',
  'Student Records Evaluator',
  'REPS',
  'SRE',
  'Other (please specify)',
] as const;

export const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed'] as const;

export const HEADCOUNT_FIELDS = [
  { key: 'faculty_members', label: 'Faculty Members' },
  { key: 'admin_members', label: 'Administrative Members' },
  { key: 'reps_members', label: 'REPS Members' },
  { key: 'ra_members', label: 'RA Members' },
  { key: 'students', label: 'Students' },
  { key: 'philcare_staff', label: 'Philcare Staff' },
  { key: 'security_personnel', label: 'Security Personnel' },
  { key: 'construction_workers', label: 'Construction Workers' },
  { key: 'tenants', label: 'Tenants' },
  { key: 'health_workers', label: 'Health Workers' },
  { key: 'non_academic_staff', label: 'Non-Academic Staff' },
  { key: 'guests', label: 'Visitors / Guests / Patients' },
] as const;

export type HeadcountKey = (typeof HEADCOUNT_FIELDS)[number]['key'];

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
    title: 'National Simultaneous Earthquake Drill Report',
    subtitle: 'NSED Status Report',
    description: 'Accidents, injuries, or any unexpected event that requires immediate attention.',
    accentColor: '#ef4444',
    dimColor: '#450a0a',
    iconShape: 'triangle',
  },
  // TODO: might remove for carousel of report types
  // {
  //   id: 'mass-casualty',
  //   title: 'Mass Casualty',
  //   subtitle: 'Multiple persons affected',
  //   description: 'Events involving multiple casualties requiring large-scale emergency response.',
  //   accentColor: '#f97316',
  //   dimColor: '#431407',
  //   iconShape: 'triangle',
  // },
  // {
  //   id: 'fire-hazard',
  //   title: 'Fire / Hazard',
  //   subtitle: 'Fire or chemical threat',
  //   description: 'Active fires, chemical spills, or environmental hazards posing immediate risk.',
  //   accentColor: '#eab308',
  //   dimColor: '#422006',
  //   iconShape: 'diamond',
  // },
];
