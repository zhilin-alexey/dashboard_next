/* eslint-disable react/display-name */
import { ArrowUpDown } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export default function SortingHeader(name: string) {
  return ({ column }: { column: any }) => {
    return (
      <Button
        className="p-0 uppercase"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {name}
        <ArrowUpDown className="ml-2 w-4 h-4" />
      </Button>
    );
  };
}