import { env } from "process";

export interface BucketInfo {
  id: string;
  globalAliases: string[];
  websiteAccess: boolean;
  websiteConfig: null;
  keys: Array<{
    accessKeyId: string;
    name: string;
    permissions: {
      read: boolean;
      write: boolean;
      owner: boolean;
    };
    bucketLocalAliases: string[];
  }>;
  objects: number;
  bytes: number;
  unfinishedUploads: number;
  unfinishedMultipartUploads: number;
  unfinishedMultipartUploadParts: number;
  unfinishedMultipartUploadBytes: number;
  quotas: {
    maxSize: null | number;
    maxObjects: null | number;
  };
}

/**
 * Retrieves information about a bucket with the specified ID.
 * Note that the bucket ID is NOT the bucket global alias.
 *
 * @param {string} bucketId - The ID of the bucket to retrieve information for.
 * @return {Promise<BucketInfo>} A promise that resolves to the bucket information.
 */
export async function getBucketInfo(bucketId: string): Promise<BucketInfo> {
  // get cookies
  const res = await fetch(env.NEXT_PUBLIC_S3_ADMIN_URL??"http://localhost:3000" + "/api/admin", {
    method: "POST",
    headers: {
      'x-route-path': `admin@bucket?id=${bucketId}`,
      'x-ssr-secret': env.SSR_SECRET??"",
    },
  });
  return (await res.json()) as BucketInfo;
}

export interface ListBucketsInfo {
  id: string;
  globalAliases: string[];
  localAliases: LocalBucketAlias[];
}

export interface LocalBucketAlias {
  accessKeyId: string;
  alias: string;
}

/**
 * Retrieves a list of all buckets.
 *
 * @return {Promise<ListBucketsInfo[]>} An array of objects containing information about the buckets.
 */
export async function listAllBuckets() {
  const res = await fetch(env.NEXT_PUBLIC_S3_ADMIN_URL??"http://localhost:3000" + "/api/admin", {
    method: "POST",
    headers: {
      'x-route-path': "admin@bucket?list",
      'x-ssr-secret': env.SSR_SECRET??"",
    },
  });
  return (await res.json()) as ListBucketsInfo[];
}