import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lpbtktppgialadyyuzdz.supabase.co'
const supabaseKey = 'sb_publishable_eNyREEgqJW219fgrtFOxEw_h-LIwFfG'

export const supabase = createClient(supabaseUrl, supabaseKey)

