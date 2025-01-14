"use client";

import { ListBucketsInfo, listAllBuckets } from "@/lib/admin";
import { usePathname } from "next/navigation";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, getBucketName } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { PiCaretUpDown, PiCheck, PiPaintBucket } from "react-icons/pi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SiAmazonroute53, SiAmazons3 } from "react-icons/si";

function BucketSelector({ current }: { current?: string }) {
  const [buckets, setBuckets] = React.useState<ListBucketsInfo[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    listAllBuckets().then((p) => {
      console.log("listbuckets", p);
      setBuckets(p);
    });
    console.log("setbuckets:", buckets);
  }, [open]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-32 h-8 dark:bg-black justify-between"
          >
            {value
              ? getBucketName(buckets.find((b) => getBucketName(b) === value))
              : current ??
                (buckets.length === 0 ? "Loading buckets" : "Search buckets")}
            {buckets.length === 0 ? (
              <Loading />
            ) : (
              <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search buckets..." />
            <CommandEmpty>No buckets found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {buckets.map((b) => (
                  <CommandItem
                    key={b.id}
                    value={getBucketName(b)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <PiCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === getBucketName(b) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {getBucketName(b)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Generate a breadcrumb layout based on the path
// For use only in bucket and folder views
export function BreadcrumbBucket({ path }: { path?: string }) {
  path = path ?? usePathname();

  let crumbs = path.split("/");
  let crumbsOrig = path.split("/");
  // Remove the first two crumbs (empty string and bucket)
  crumbs.shift();
  crumbs.shift();
  // remove bucket name for use elsewhere
  const bucket = crumbs.shift();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={crumbsOrig.slice(0, 2).join("/")}>
            <SiAmazons3
              className="h-6 w-6 dark:text-slate-300"
              strokeWidth="1"
            />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.length > 0 || bucket ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BucketSelector current={bucket} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : (
          <div className="text-3xl -my-6 ml-1.5 dark:text-white">Buckets</div>
        )}
        {crumbs.map((e, i) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumbsOrig.slice(0, i + 4).join("/")}>
                {e}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const Loading = () => (
  <div className="h-6 w-6 animate-[spin_3.5s_ease-in-out_infinite]">
    <div
      className=" h-full w-full animate-[spin_1s_linear_infinite] rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  </div>
);
