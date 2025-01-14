import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // defaults to auto

const baseAdminURL = "https://s3-admin-api.lut.li/v1";
const adminSecret = "orPjHrgY7GPcBASNt3o0TR0hvKsjOaIo3TuDNLjQlxk=";

export async function POST(request: Request) {
  let path = request.headers.get("x-route-path");
  if (path === null) {
    return new Response("bad path", { status: 400 });
  }
  // verify jwt or get ssr secret
  if (request.headers.get("x-ssr-secret") !== process.env.SSR_SECRET) {
    try {
      const jwt = cookies().get("jwt")?.value ?? "";
      console.log("jwt", jwt);
      const jwtPayload = JSON.parse(atob(jwt.split(".")[0]));
      if (Date.now() >= jwtPayload.exp * 1000) throw Error("jwt expired");
    } catch {
      return new Response("jwt expired", { status: 401 });
    }
  }
  const res = await fetch(`${baseAdminURL}/${path.replace("admin@", "")}`, {
    headers: {
      Authorization: `Bearer ${adminSecret}`,
    },
  });
  let j = await res.json();
  return Response.json(j);
}
