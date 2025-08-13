import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {

  



  const token = req.cookies.get('token')?.value;
  console.log("token from client: " + token)
  const secret_base64 = process.env.JWT_SECRET
    if (!secret_base64) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const secretKey = Buffer.from(secret_base64, 'base64'); // 👈 important

  // console.log("JWT Secret: ",  secret)

  // if (!token) {
  //   return NextResponse.json({ authenticated: false }, { status: 401 });
  // }

  try {
      console.log("trying to decode token")

      if(token != undefined){
    const decoded = jwt.verify(token, secretKey,  { algorithms: ['HS256'] });

    console.log("decoded token: ", decoded)

    return NextResponse.json({
      authenticated: true,
      user: decoded,
    });
      }


  } catch (err) {
    return NextResponse.json({ err, authenticated: false }, { status: 401 });
  }
}