import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface Location {
  id: string;
  name: string;
  cluster_id: string;
}

export function useLocations(clusterId?: string) {
  return useQuery({
    queryKey: ['locations', clusterId],
    queryFn: async (): Promise<Location[]> => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, cluster_id')
        .eq('cluster_id', clusterId!)
        .order('name');
      if (error) throw new Error(error.message);
      return (data ?? []) as Location[];
    },
    enabled: !!clusterId,
    staleTime: Infinity,
  });
}
