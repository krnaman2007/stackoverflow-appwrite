import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  await Promise.all([
    getOrCreateDB(),
    getOrCreateStorage()
  ])
  return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  //match all requests paths except for the ones that start with:
  //- api
  //- _next/static
  //- _next/images
  //- favicon.com  
  matcher: [
    '/((?!api|_next/static|_next/images|favicon.ico).*)',
  ],
}