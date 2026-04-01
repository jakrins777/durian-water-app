import { createClient } from '@supabase/supabase-js'

// ดึงค่า URL และ Key มาจากไฟล์ .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY // ตรงนี้เปลี่ยนชื่อตัวแปรให้ตรงกับในไฟล์ .env ของคุณ

// สร้างตัวเชื่อมต่อ
export const supabase = createClient(supabaseUrl, supabaseKey)