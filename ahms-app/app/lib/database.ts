import { supabase } from './supabaseClient';

export const submitApplication = async (formData: any) => {
  const { data, error } = await supabase
    .from('housing_applications')
    .insert([
      { 
        full_name: formData.name,
        income: formData.income,
        is_victim: formData.isVictim,
        priority_score: formData.score,
        status: 'pending'
      },
    ]);

  if (error) throw error;
  return data;
};