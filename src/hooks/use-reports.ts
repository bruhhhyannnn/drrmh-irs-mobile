import type { BystanderReportFormData, ReportFormData } from '@/lib';
import { supabase } from '@/lib';
import { HEADCOUNT_FIELDS } from '@/types';
import { useAuthStore } from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ReportCasualtyEntry {
  id: string;
  condition_id: string;
  count: number;
  names: string | null;
}

export interface ReportMissingPersonEntry {
  id: string;
  name: string;
}

export interface ReportDamageEntry {
  id: string;
  damage_condition_id: string;
}

export interface Report {
  id: string;
  event_id: string;
  cluster_id: string;
  unit_id: string | null;
  location_id: string | null;
  submitted_at: string;
  created_at: string;
  faculty_members: number;
  admin_members: number;
  reps_members: number;
  ra_members: number;
  students: number;
  philcare_staff: number;
  security_personnel: number;
  construction_workers: number;
  tenants: number;
  health_workers: number;
  non_academic_staff: number;
  guests: number;
  missing_count: number;
  casualties_count: number;
  event: { id: string; name: string };
  cluster: { id: string; name: string };
  unit: { id: string; name: string } | null;
  location: { id: string; name: string } | null;
  casualties: ReportCasualtyEntry[];
  missing_persons: ReportMissingPersonEntry[];
  damages: ReportDamageEntry[];
  reporter_type: 'authenticated' | 'bystander';
}

const REPORT_LIST_SELECT = `
  id, event_id, cluster_id, unit_id, location_id, submitted_at, created_at,
  faculty_members, admin_members, reps_members, ra_members, students,
  philcare_staff, security_personnel, construction_workers, tenants,
  health_workers, non_academic_staff, guests, missing_count, casualties_count,
  event:events(id, name),
  cluster:clusters(id, name),
  unit:units(id, name),
  location:locations(id, name)
`;

const REPORT_DETAIL_SELECT = `
  ${REPORT_LIST_SELECT},
  casualties:report_casualties(id, condition_id, count, names),
  missing_persons:report_missing_persons(id, name),
  damages:report_damages(id, damage_condition_id)
`;

// ─── Lookup helpers ───────────────────────────────────────────────────────────

async function resolveIds(params: {
  clusterName: string;
  unitName?: string;
  locationName?: string;
}): Promise<{ cluster_id: string; unit_id?: string; location_id?: string }> {
  const { data: cluster, error: cErr } = await supabase
    .from('clusters')
    .select('id')
    .eq('name', params.clusterName)
    .single();

  if (cErr || !cluster) throw new Error(`Cluster "${params.clusterName}" not found`);

  const result: { cluster_id: string; unit_id?: string; location_id?: string } = {
    cluster_id: cluster.id,
  };

  if (params.unitName) {
    const { data: unit } = await supabase
      .from('units')
      .select('id')
      .eq('name', params.unitName)
      .eq('cluster_id', cluster.id)
      .single();
    if (unit) result.unit_id = unit.id;
  }

  if (params.locationName) {
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('name', params.locationName)
      .eq('cluster_id', cluster.id)
      .single();
    if (location) result.location_id = location.id;
  }

  return result;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useMyReports() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['reports', 'mine', user?.id],
    queryFn: async (): Promise<Report[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('reports')
        .select(REPORT_LIST_SELECT)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []).map((r) => ({
        ...r,
        casualties: [],
        missing_persons: [],
        damages: [],
      })) as unknown as Report[];
    },
    enabled: !!user?.id,
    refetchOnMount: 'always',
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: async (): Promise<Report | null> => {
      const { data, error } = await supabase
        .from('reports')
        .select(REPORT_DETAIL_SELECT)
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Report;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: ReportFormData) => {
      const { casualties, missing_persons, damage_condition_id, ...reportData } = payload;

      const { data: report, error } = await supabase
        .from('reports')
        .insert({ ...reportData, user_id: user?.id ?? null })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const casualtyRows = casualties
        .filter((c) => !!c.condition_id)
        .map((c) => ({
          report_id: report.id,
          condition_id: c.condition_id!,
          count: 1,
          names: c.names,
        }));
      if (casualtyRows.length > 0) {
        const { error: cErr } = await supabase.from('report_casualties').insert(casualtyRows);
        if (cErr) throw new Error(`Casualties: ${cErr.message}`);
      }

      const missingRows = missing_persons
        .filter((mp) => mp.name.trim().length > 0)
        .map((mp) => ({ report_id: report.id, name: mp.name.trim() }));
      if (missingRows.length > 0) {
        const { error: mErr } = await supabase.from('report_missing_persons').insert(missingRows);
        if (mErr) throw new Error(`Missing persons: ${mErr.message}`);
      }

      if (damage_condition_id) {
        const { error: dErr } = await supabase.from('report_damages').insert({
          report_id: report.id,
          damage_condition_id,
        });
        if (dErr) throw new Error(`Damage report: ${dErr.message}`);
      }

      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'mine', user?.id] });
    },
  });
}

export function useUpdateReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReportFormData) => {
      const { casualties, missing_persons, damage_condition_id, ...reportData } = payload;

      const { data, error } = await supabase
        .from('reports')
        .update(reportData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      await supabase.from('report_casualties').delete().eq('report_id', id);
      const casualtyRows = casualties
        .filter((c) => !!c.condition_id)
        .map((c) => ({ report_id: id, condition_id: c.condition_id!, count: 1, names: c.names }));
      if (casualtyRows.length > 0) {
        const { error: cErr } = await supabase.from('report_casualties').insert(casualtyRows);
        if (cErr) throw new Error(`Casualties: ${cErr.message}`);
      }

      await supabase.from('report_missing_persons').delete().eq('report_id', id);
      const missingRows = missing_persons
        .filter((mp) => mp.name.trim().length > 0)
        .map((mp) => ({ report_id: id, name: mp.name.trim() }));
      if (missingRows.length > 0) {
        const { error: mErr } = await supabase.from('report_missing_persons').insert(missingRows);
        if (mErr) throw new Error(`Missing persons: ${mErr.message}`);
      }

      await supabase.from('report_damages').delete().eq('report_id', id);
      if (damage_condition_id) {
        const { error: dErr } = await supabase.from('report_damages').insert({
          report_id: id,
          damage_condition_id,
        });
        if (dErr) throw new Error(`Damage report: ${dErr.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useCreateBystanderReport() {
  return useMutation({
    mutationFn: async (payload: BystanderReportFormData) => {
      const { casualties, missing_persons, damage_condition_id, ...rest } = payload;

      const headcountData = Object.fromEntries(
        HEADCOUNT_FIELDS.map((f) => [f.key, (rest as any)[f.key] ?? 0])
      );

      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          event_id: rest.event_id,
          cluster_id: rest.cluster_id || null,
          unit_id: rest.unit_id || null,
          location_id: rest.location_id || null,
          casualties_count: rest.casualties_count,
          missing_count: rest.missing_count,
          ...headcountData,
          reporter_type: 'bystander',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Bystander report insert error:', JSON.stringify(error));
        throw new Error(error.message);
      }

      const casualtyRows = (casualties ?? [])
        .filter((c) => !!c.condition_id)
        .map((c) => ({ report_id: report.id, condition_id: c.condition_id!, count: 1, names: c.names }));
      if (casualtyRows.length > 0) {
        const { error: cErr } = await supabase.from('report_casualties').insert(casualtyRows);
        if (cErr) throw new Error(`Casualties: ${cErr.message}`);
      }

      const missingRows = (missing_persons ?? [])
        .filter((mp) => mp.name.trim().length > 0)
        .map((mp) => ({ report_id: report.id, name: mp.name.trim() }));
      if (missingRows.length > 0) {
        const { error: mErr } = await supabase.from('report_missing_persons').insert(missingRows);
        if (mErr) throw new Error(`Missing persons: ${mErr.message}`);
      }

      if (damage_condition_id) {
        const { error: dErr } = await supabase.from('report_damages').insert({
          report_id: report.id,
          damage_condition_id,
        });
        if (dErr) throw new Error(`Damage report: ${dErr.message}`);
      }

      return report;
    },
  });
}

export { resolveIds };
