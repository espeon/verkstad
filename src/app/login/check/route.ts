import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";
import { useSearchParams } from "next/navigation";

const baseAdminURL = "https://s3-admin-api.lut.li/v1";
const adminSecret = "orPjHrgY7GPcBASNt3o0TR0hvKsjOaIo3TuDNLjQlxk=";

interface GarageKeyInformation {
  name: string;
  accessKeyId: string;
  secretAccessKey: string | undefined;
  permissions: Map<string, boolean>;
  buckets: string[];
}

let formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(500),
});

export async function GET(request: Request) {
  let params = useSearchParams();
  if(params.get("jwt") !== null){
    cookies().delete("jwt");
  }
}

export async function POST(request: Request) {
  // get form data
  const form = await ((await new Response(request.body).json()) as Promise<
    z.infer<typeof formSchema>
  >);

  const res = await fetch(
    `${baseAdminURL}/key?id=${form.username}&showSecretKey=true`,
    {
      headers: {
        Authorization: `Bearer ${adminSecret}`,
      },
    }
  );

  const data = (await res.json()) as GarageKeyInformation;

  console.log(data);

  if (
    data.secretAccessKey !== undefined &&
    data.secretAccessKey === form.password
  ) {
    // return ok response
    // calculate expiry time
    const expires = new Date(Date.now() + 1209600000); // 2 weeks
    const jwt = await new jose.EncryptJWT({
      name: data.name,
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
      permissions: data.permissions,
      buckets: data.buckets,
    })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setIssuedAt()
      .setIssuer("urn:lutea:verkstad")
      .setAudience("urn:lutea:audience")
      .setExpirationTime(expires)
      .encrypt(
        jose.base64url.decode("baluqilh3ibcefrhcilu4wbfuiqbrilbwc2iuqfhlqg")
      );
    let j = `${btoa(expires.getTime().toString())}.${jwt}`;
    cookies().set("jwt", j);
    return new Response(j);
  } else return new Response("no");
}
