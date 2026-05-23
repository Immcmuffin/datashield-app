import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
  'https://raiddanqvnzxyjwfmyqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhaWRkYW5xdm56eHlqd2ZteXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5OTg4NzMsImV4cCI6MjA5MTU3NDg3M30.2sPdadvXYqkpBXccx59S77mvbDTJHV0vRPqmMVQUC7s',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
