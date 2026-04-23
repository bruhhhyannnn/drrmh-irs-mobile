import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface AppEvent {
  id: string;
  name: string;
  description: string | null;
  quarter: string | null;
  started_at: string | null;
  ended_at: string | null;
  status: { id: string; name: string };
  location: { id: string; name: string } | null;
}

async function fetchOngoingEvents(): Promise<AppEvent[]> {
  const { data: statusRow, error: statusError } = await supabase
    .from('event_statuses')
    .select('id')
    .eq('name', 'Ongoing')
    .single();

  if (statusError || !statusRow) return [];

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, description, quarter, started_at, ended_at, status:event_statuses(id, name), location:locations(id, name)'
    )
    .eq('status_id', statusRow.id)
    .order('started_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AppEvent[];
}

async function fetchEvent(id: string): Promise<AppEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, description, quarter, started_at, ended_at, status:event_statuses(id, name), location:locations(id, name)'
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as AppEvent;
}

async function fetchAllEvents(): Promise<AppEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, description, quarter, started_at, ended_at, status:event_statuses(id, name), location:locations(id, name)'
    )
    .order('started_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AppEvent[];
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOngoingEvents() {
  return useQuery({
    queryKey: ['events', 'ongoing'],
    queryFn: fetchOngoingEvents,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useAllEvents() {
  return useQuery({
    queryKey: ['events', 'all'],
    queryFn: fetchAllEvents,
    staleTime: 1000 * 60 * 2,
  });
}
