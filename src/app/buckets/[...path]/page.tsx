import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BreadcrumbBucket } from "@/components/breadcrumbBucket";
import { getS3Client } from "@/lib/s3api";
import { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

async function getBucketObjects (path: string[], jwt: string): Promise<ListObjectsV2CommandOutput> {
    let s3 = await getS3Client(jwt);
    // redirect to login
    if(s3 === undefined) throw new Error("JWT fishy");

    let items = await s3.listObjectsV2({Bucket: path[0], Prefix: path.slice(1).join("/"), });
    return items;
}

export default async function BucketDisplay({ params }: { params: { path: string[] } }) {
  const jwt = cookies().get("jwt")?.value;

  if (jwt === undefined) {
    // redirect to login, with a # to the current page
    redirect("/login#");
  }

  let objs = await getBucketObjects(params.path, jwt);
  console.log(objs.Contents)
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center px-24 text-slate-900 dark:text-white text-wrap">
      <div className="max-w-screen-2xl w-full flex-1 mt-6">
        <BreadcrumbBucket />
        {objs.Contents?.map((obj) => <div>obj.Key</div>)}
      </div>
    </main>
  );
}
