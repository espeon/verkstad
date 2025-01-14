import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ListBucketsInfo } from "./admin"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBucketName(b?: ListBucketsInfo, key?: string) {
  if(b === undefined){
    return undefined
  }
  if(b.globalAliases.length > 0) 
    return b.globalAliases[0]
  else if(b.localAliases.length > 0){
    return (b.localAliases.find(l => l.accessKeyId === key) ?? b.localAliases[0]).alias
  } else {
    return "Unnamed bucket"
  }
}