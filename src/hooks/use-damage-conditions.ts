import { supabase } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export interface DamageCondition {
  id: string;
  name: string;
}

export function useDamageConditions() {
  return useQuery({
    queryKey: ['damage_conditions'],
    queryFn: async (): Promise<DamageCondition[]> => {
      const { data, error } = await supabase
        .from('damage_conditions')
        .select('id, name')
        .order('name');
      if (error) throw new Error(error.message);
      return (data ?? []) as DamageCondition[];
    },
    staleTime: Infinity,
  });
}
