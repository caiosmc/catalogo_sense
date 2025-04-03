// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jllniaxakvppdwuglesh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbG5pYXhha3ZwcGR3dWdsZXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjU5ODYsImV4cCI6MjA1OTIwMTk4Nn0.xOiES3B3WiPwpG7ZmU-poCVKC4jYcgFQX_51UNxxfio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
