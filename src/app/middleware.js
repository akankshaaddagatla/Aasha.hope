// import { createServerClient } from '@supabase/ssr'
// import { NextResponse } from 'next/server'

// export async function middleware(request) {
//   // Start with a response object
//   let response = NextResponse.next()

//   // Initialize Supabase server client for SSR
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         get(name) {
//           return request.cookies.get(name)?.value
//         },
//         set(name, value, options) {
//           response.cookies.set(name, value, options)
//         },
//         remove(name, options) {
//           response.cookies.set(name, '', options)
//         },
//       },
//     }
//   )

//   // Get the current user
//   const { data, error } = await supabase.auth.getUser()
//   const user = data?.user

//   // Define route categories
//   const protectedRoutes = [
//     '/users',        // covers /users/admin/dashboard & /users/donor/dashboard
//     '/ngo',          // covers /ngo/dashboard
//   ]
//   const authPages = ['/login', '/signup']

//   // 1️⃣ Redirect unauthenticated users away from protected routes
//   if (!user && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // 2️⃣ Redirect authenticated users away from login/signup
//   if (user && authPages.includes(request.nextUrl.pathname)) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return response
// }

// // Middleware applies to these paths
// export const config = {
//   matcher: [
//     '/users/:path*',   // all nested user dashboards
//     '/ngo/:path*',     // NGO dashboard
//     '/login',
//     '/signup',
//   ],
// }
