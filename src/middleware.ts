import { NextResponse  } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export {default} from "next-auth/middleware"


 



export async  function middleware(request: NextRequest) {
//   console.log(request.headers)
  console.log(process.env.NEXT_AUTH_SECRET)
  const token = await getToken({req : request , secret: process.env.NEXT_AUTH_SECRET})
  // console.log(token)
  const url = request.nextUrl
//   console.log(url)
  // console.log(token)
  if (!token && !(url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if(token && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
}
 
export const config = {
  matcher: ['/sign-in','/sign-up','/add-question','/dashboard','/profile'],
}
