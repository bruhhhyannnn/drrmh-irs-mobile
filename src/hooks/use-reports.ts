import type { ReportFormData } from '@/lib';
import { supabase } from '@/lib';
import { useAuthStore } from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
}

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
        .select(
          `id, event_id, cluster_id, unit_id, location_id, submitted_at, created_at,
           faculty_members, admin_members, reps_members, ra_members, students,
           philcare_staff, security_personnel, construction_workers, tenants,
           health_workers, non_academic_staff, guests, missing_count, casualties_count,
           event:events(id, name),
           cluster:clusters(id, name),
           unit:units(id, name),
           location:locations(id, name)`
        )
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Report[];
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
        .select(
          `id, event_id, cluster_id, unit_id, location_id, submitted_at, created_at,
           faculty_members, admin_members, reps_members, ra_members, students,
           philcare_staff, security_personnel, construction_workers, tenants,
           health_workers, non_academic_staff, guests, missing_count, casualties_count,
           event:events(id, name),
           cluster:clusters(id, name),
           unit:units(id, name),
           location:locations(id, name)`
        )
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
      const { data, error } = await supabase
        .from('reports')
        .insert({ ...payload, user_id: user?.id ?? null })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'mine', user?.id] });
    },
  });
}

export function useUpdateReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<ReportFormData>) => {
      const { data, error } = await supabase
        .from('reports')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export { resolveIds };
