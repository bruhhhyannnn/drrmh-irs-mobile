export const CLUSTERS = ['Pedro Gil', 'Padre Faura', 'Taft', 'SHS', 'PGH'] as const;

export type Cluster = (typeof CLUSTERS)[number];

export const UNITS: Record<Cluster, string[]> = {
  'Pedro Gil': [
    'College of Public Health',
    'College of Arts and Sciences',
    'School of Health Sciences',
    'Institute of Herbal Medicine',
    'National Institutes of Health',
    'Office of the Chancellor',
  ],
  'Padre Faura': [
    'College of Medicine',
    'College of Dentistry',
    'College of Allied Medical Professions',
    'Institute of Ophthalmology',
    'Department of Physical Therapy',
  ],
  Taft: [
    'College of Pharmacy',
    'College of Nursing',
    'School of Health Technology Management',
    'University Library',
  ],
  SHS: ['Senior High School'],
  PGH: [
    'Philippine General Hospital',
    'PGH Emergency Department',
    'PGH Outpatient Department',
    'PGH Medical Services',
    'PGH Nursing Services',
    'PGH Administrative Division',
  ],
};

export const LOCATIONS: Record<Cluster, string[]> = {
  'Pedro Gil': [
    'CPH Building',
    'CAS Building',
    'Administration Building',
    'University Library',
    'Gymnasium',
    'Covered Court',
    'Pedro Gil Parking Area',
  ],
  'Padre Faura': [
    'COM Building',
    'CDent Building',
    'CAMP Building',
    'Padre Faura Gate',
    'Padre Faura Lobby',
    'Padre Faura Quadrangle',
  ],
  Taft: ['CP Building', 'CN Building', 'Taft Lobby', 'Taft Quadrangle', 'Taft Parking Area'],
  SHS: ['SHS Main Building', 'SHS Covered Court', 'SHS Grounds'],
  PGH: [
    'PGH Main Building',
    'PGH Emergency Room',
    'PGH OPD Building',
    'PGH Ward 1',
    'PGH Ward 2',
    'PGH Ward 3',
    'PGH ICU',
    'PGH Lobby',
    'PGH Parking Area',
  ],
};

export const POSITIONS = [
  'DRRM-H Coordinator',
  'Unit DRRM Coordinator',
  'ERT Leader',
  'ERT Member',
  'Department Head',
  'Faculty',
  'Staff',
  'Student Representative',
  'Security Officer',
  'Medical Officer',
  'Nurse',
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
