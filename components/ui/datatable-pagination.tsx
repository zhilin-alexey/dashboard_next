import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  return (
    <div className="items-center px-2 py-2 uppercase">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 w-full">
          <p className="font-medium text-sm">Строк на странице</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="border-purple-300 dark:bg-black bg-white">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="justify-center items-center w-full font-medium text-center text-sm md:text-left">
          Страница {table.getState().pagination.pageIndex + 1} из{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="lg:flex hidden p-0 w-8 h-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Перейти на первую страницу</span>
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="p-0 w-8 h-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Вернуться на предыдущую страницу</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="p-0 w-8 h-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Перейти на следующую страницу</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="lg:flex hidden p-0 w-8 h-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Перейти на последнюю страницу</span>
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
