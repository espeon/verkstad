"use client";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { PiPencil, PiTrashSimple } from "react-icons/pi";

export type BucketInfoTable = {
  id: string;
  name: string;
  objects: number;
  bytes: number;
  permissions: Map<string, boolean>;
  maxSize: null | number;
  maxObjects: null | number;
};

export const bucketColumns: ColumnDef<BucketInfoTable>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      let v: string = row.getValue("name");
      return <Link href={`/buckets/${v}`}>{v}</Link>
    },
  },
  {
    accessorKey: "objects",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Objects" />
    )
  },
  {
    accessorKey: "bytes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bytes" />
    )
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      let v: Map<string, boolean> = row.getValue("permissions");
      let ret: string[] = [];
      v.forEach((val, key) => (val ? ret.push(key) : ""));
      return ret.map((v) => v[0].toUpperCase() + v.slice(1)).join(" · ");
    },
  },
  {
    accessorKey: "maxSize",
    header: "Max Size",
  },
  {
    accessorKey: "maxObjects",
    header: "Max Objects",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      // get id
      let id = row.getValue("id");
      return (
        <div className="bg-slate-300 m-auto flex flex-row align-middle items-center max-w-full">
            <div className="flex-1" />
          <Button
            variant="link"
            className="group px-2 -my-8 hover:bg-slate-800"
          >
            <PiPencil className="h-6 w-6 group-hover:text-teal-500" />
          </Button>
          <Button
            variant="link"
            className="group px-2 -my-8 hover:bg-red-800"
          >
            <PiTrashSimple className="h-6 w-6 group-hover:text-red-300 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
