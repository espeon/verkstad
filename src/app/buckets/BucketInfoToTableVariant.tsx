import { BucketInfo, ListBucketsInfo } from "@/lib/admin";
import { getBucketName } from "@/lib/utils";

export async function BucketInfoToTableVariant(
  item: BucketInfo,
  thisAccessKey: string
) {
  console.log("bucket item", item);
  // create permissions
  let permsObject = item.keys.filter(
    (key) => key.accessKeyId === thisAccessKey
  );
  console.log("perms obj", permsObject);
  let perms = new Map();
  if(permsObject.length > 0) {
    let p0 = permsObject[0];
    perms.set("read", p0.permissions.read);
    perms.set("write", p0.permissions.write);
    perms.set("owner", p0.permissions.owner);
  } else {
    perms.set("read", false);
    perms.set("write", false);
    perms.set("owner", false);
  }

  let k = item.keys

  let binfo: ListBucketsInfo = {
    globalAliases: item.globalAliases,
    id: item.id,
    localAliases: item.keys.map((key) => {
      return {
        accessKeyId: key.accessKeyId,
        alias: key.bucketLocalAliases[0],
      };
    }),
  };

  return {
    id: item.id,
    name: getBucketName(binfo, thisAccessKey) as string,
    objects: item.objects,
    bytes: item.bytes,
    permissions: perms,
    maxSize: item.quotas.maxSize,
    maxObjects: item.quotas.maxObjects,
  };
}
