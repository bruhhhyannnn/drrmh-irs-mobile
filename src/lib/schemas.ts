import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const headcountField = () => z.number().int().min(0);

export const reportSchema = z.object({
  event_id: z.string().uuid('Event is required'),
  cluster_id: z.string().uuid('Cluster is required'),
  unit_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),

  faculty_members: headcountField(),
  admin_members: headcountField(),
  reps_members: headcountField(),
  ra_members: headcountField(),
  students: headcountField(),
  philcare_staff: headcountField(),
  security_personnel: headcountField(),
  construction_workers: headcountField(),
  tenants: headcountField(),
  health_workers: headcountField(),
  non_academic_staff: headcountField(),
  guests: headcountField(),

  missing_count: headcountField(),
  casualties_count: headcountField(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
