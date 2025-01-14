import { env } from "process";
import { S3 } from "@aws-sdk/client-s3";
import { decryptTJWT, decryptTJWTsync } from "./jwt";

export function getS3(jwt: string): S3 | undefined {
    let jwtPayload = decryptTJWTsync(jwt);
    if(jwtPayload === undefined) return undefined;
    let url = new URL(env.NEXT_PUBLIC_S3_API_URL ?? "https://play.min.io:9000");
    return new S3({
        endpoint: url.href,
        region: "us-east-1",
        credentials: {
            accessKeyId: jwtPayload.payload.accessKeyId,
            secretAccessKey: jwtPayload.payload.secretAccessKey,
        },
    });
}

export async function getS3Client(jwt: string): Promise<S3> {
    let jwtPayload = (await decryptTJWT(jwt)).payload;
    let url = new URL(env.NEXT_PUBLIC_S3_API_URL ?? "https://play.min.io:9000");
    return new S3({
        endpoint: url.href,
        region: "us-east-1",
        // to remove after i set up subdomain style
        forcePathStyle: true,
        credentials: {
            accessKeyId: jwtPayload.accessKeyId,
            secretAccessKey: jwtPayload.secretAccessKey,
        },
    });
}