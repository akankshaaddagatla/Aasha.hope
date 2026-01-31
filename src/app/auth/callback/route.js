// import { createClient } from '@/lib/supabase/server'
// import { NextResponse } from 'next/server'

// export async function GET(request) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')

//   if (code) {
//     const supabase = await createClient()
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // Redirect to home page after successful auth
//   return NextResponse.redirect(new URL('/dashboard', request.url))
// }