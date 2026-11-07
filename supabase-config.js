// Supabase 연결 정보
// 여기에는 "공개용 키"만 넣습니다. secret / service_role 키는 절대 넣지 마세요.
window.SUPABASE_URL = 'https://risyghrbkedutaaofpdn.supabase.co';
window.SUPABASE_KEY = 'sb_publishable_hsxdEsiw87uqdYODjMKH1Q_wdMOAYNH';

window.db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
