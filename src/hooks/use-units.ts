import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface Unit {
  id: string;
  name: string;
  cluster_id: string;
}

export function useUnits(clusterId?: string) {
  return useQuery({
    queryKey: ['units', clusterId],
    queryFn: async (): Promise<Unit[]> => {
      const { data, error } = await supabase
        .from('units')
        .select('id, name, cluster_id')
        .eq('cluster_id', clusterId!)
        .order('name');
      if (error) throw new Error(error.message);
      console.log(data);
      return (data ?? []) as Unit[];
    },
    enabled: !!clusterId,
    staleTime: Infinity,
  });
}
