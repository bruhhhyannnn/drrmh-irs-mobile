import { HEADCOUNT_FIELDS } from '@/types';
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

  damage_condition_id: z.string().uuid().optional(),

  casualties: z.array(
    z.object({
      condition_id: z.string().uuid().optional(),
      names: z.string().optional(),
    })
  ),

  missing_persons: z.array(z.object({ name: z.string() })),

  reporter_type: z.enum(['authenticated', 'bystander']),
});

export const bystanderReportSchema = z.object({
  event_id: z.string().uuid('Event is required'),
  cluster_id: z.string().optional(),
  unit_id: z.string().optional(),
  location_id: z.string().optional(),
  ...Object.fromEntries(HEADCOUNT_FIELDS.map((f) => [f.key, z.number().int().min(0)])),
  casualties_count: z.number().int().min(0),
  missing_count: z.number().int().min(0),
  damage_condition_id: z.string().uuid().optional(),
  casualties: z.array(
    z.object({ condition_id: z.string().uuid().optional(), names: z.string().optional() })
  ),
  missing_persons: z.array(z.object({ name: z.string() })),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type BystanderReportFormData = z.infer<typeof bystanderReportSchema>;
