import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pywujklypfxnjuqgrzvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d3Vqa2x5cGZ4bmp1cWdyenZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTI1OTksImV4cCI6MjA2ODYyODU5OX0.8teRt_rAPfyMUV8jOrL2FtdWXN2hm3JtWMMRJ1OA0BQ'
);

export default supabase;

