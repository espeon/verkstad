import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptTJWT } from "@/lib/jwt";
import { BucketInfo, getBucketInfo, listAllBuckets } from "@/lib/admin";
import { DataTable } from "@/components/ui/datatable";
import { BucketInfoTable, bucketColumns } from "./datashape";
import { BucketInfoToTableVariant } from "./BucketInfoToTableVariant";
import { BreadcrumbBucket } from "@/components/breadcrumbBucket";

async function getBuckets(tjwt: string): Promise<BucketInfoTable[]> {
  let jwt = (await decryptTJWT(tjwt)).payload;

  console.log("JWT", jwt);

  /*     var minio = new MinioClient({
        endPoint: 's3.lut.li',
        accessKey: jwt.accessKeyId,
        secretKey: jwt.secretAccessKey,
      })

    let items = await minio.listBuckets(); */

  let items = await listAllBuckets();

  let i = await Promise.all(
    items.map(async (item) =>
      BucketInfoToTableVariant(await getBucketInfo(item.id), jwt.accessKeyId)
    )
  );
  return i;
}

export default async function BucketDisplay() {
  const jwt = cookies().get("jwt")?.value;

  if (jwt === undefined) {
    // redirect to login, with a # to the current page

    redirect("/login#");
  }
  let bucketInfo = await getBuckets(jwt);
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center px-24 text-slate-900 dark:text-white text-wrap">
      <div className="max-w-screen-2xl w-full flex-1 mt-6">
        <BreadcrumbBucket />
        <DataTable
          columns={bucketColumns}
          data={bucketInfo}
          defaultVisibility={{ id: false }}
        />
      </div>
    </main>
  );
}
