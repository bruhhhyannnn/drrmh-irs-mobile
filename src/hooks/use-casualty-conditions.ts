import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface CasualtyCondition {
  id: string;
  name: string;
}

export function useCasualtyConditions() {
  return useQuery({
    queryKey: ['casualty_conditions'],
    queryFn: async (): Promise<CasualtyCondition[]> => {
      const { data, error } = await supabase
        .from('casualty_conditions')
        .select('id, name')
        .order('name');
      if (error) throw new Error(error.message);
      return (data ?? []) as CasualtyCondition[];
    },
    staleTime: Infinity,
  });
}
