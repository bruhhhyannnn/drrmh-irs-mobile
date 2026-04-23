import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface Cluster {
  id: string;
  name: string;
}

export function useClusters() {
  return useQuery({
    queryKey: ['clusters'],
    queryFn: async (): Promise<Cluster[]> => {
      const { data, error } = await supabase.from('clusters').select('id, name').order('name');
      if (error) throw new Error(error.message);
      return (data ?? []) as Cluster[];
    },
    staleTime: Infinity,
  });
}
