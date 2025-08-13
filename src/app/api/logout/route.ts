import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0
  });
  
  return new Response("Cookie deleted", { status: 200 });
}