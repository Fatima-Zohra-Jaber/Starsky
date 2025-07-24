import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
  // process.env.SUPABASE_SERVICE_ROLE_KEY // Utiliser la Service Role Key pour contourner RLS
);

export default supabase;


// create table public.projects (
//   id uuid primary key default gen_random_uuid(),
//   title text not null,
//   content jsonb not null,
//   user_id uuid references auth.users(id) on delete cascade,
//   created_at timestamp with time zone default now()
// ) 
