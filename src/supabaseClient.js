import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogzdhsddpulmdvhyyydh.supabase.co';
const supabaseKey = 'sb_publishable_wr85sqExLKV09v3LGb5yiQ__np-OwuP';

export const supabase = createClient(supabaseUrl, supabaseKey);