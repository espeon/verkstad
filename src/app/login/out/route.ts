import { cookies } from "next/headers";

export async function POST(request: Request) {
    cookies().delete('jwt');
    console.log("ok");
    return new Response("ok");
}
