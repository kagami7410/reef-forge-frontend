// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { error } from 'console';
// export function middleware(request: NextRequest) {
//   console.log("🔐 Middleware is running...");

//   const token = request.cookies.get('token')?.value;
//       console.log("trying to decode token")

//   const secret_base64 = process.env.JWT_SECRET
//     if (!secret_base64) {
//   throw new Error('JWT_SECRET is not defined in environment variables');
// }
// const secretKey = Buffer.from(secret_base64, 'base64'); // 👈 important
//   const protectedPaths = ['/postItem', '/admin'];
//   const isProtected = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );
// // try{
// //   console.log("--------------------------------------trying to decode token for postItem-------------------------")
// //     const decodedToken = jwt.verify(token, secretKey,  { algorithms: ['HS256'] });
// //   if (decodedToken === undefined || isProtected && decodedToken.user.isAdmin!="true") {
// //     return NextResponse.redirect(new URL('/login', request.url));
// //   }
// // }
// // catch{
// //   error("error validating token")
// // }


//   // if (isProtected) {
//   //   return NextResponse.redirect(new URL('/signIn', request.url));
//   // }


//     return NextResponse.redirect(new URL('/signIn', request.url));


//   // return NextResponse.next();
// }

// // Optionally define only paths this runs for:
// export const config = {
//   matcher: ['/postItem','/', '/admin/:path*'], // Adjust to your needs
// };




import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("🔐 Middleware is running for:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Match root page to test
};