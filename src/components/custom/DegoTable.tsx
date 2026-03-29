

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import { IconPlus, IconSearch } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CustomButton } from "./Button";

interface GenericDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onAddData?: () => void;
  placeholder?: string;
}

export function DegoTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onAddData,
  placeholder = "Search...",
}: GenericDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageSize:5,
    pageIndex:0
  })
  const memoColumn = useMemo(() => columns,[columns])
  const memoData = useMemo(() => data,[data])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data:memoData,
    columns:memoColumn,
    state: { sorting, rowSelection, columnFilters, pagination },
    onPaginationChange:setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination:false,
    autoResetPageIndex:false
  });

  return (
    <div className="w-full space-y-4 px-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72 ">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4  text-green-500" />
          <Input
            placeholder={placeholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="pl-8 border-green-400 focus:border-green-400"
          />
        </div>
        <CustomButton onClick={onAddData} size="sm" className="cursor-pointer">
          <IconPlus className="mr-2 h-4 w-4" /> Add New
        </CustomButton>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className=" bg-green-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize.toString() }`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
          
                    >
                        <SelectTrigger className="h-8 w-17.5 border-green-400">
                          <SelectValue placeholder={table.getState().pagination.pageSize.toString()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 15, 30, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize }
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex w-25 items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex } of{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        className="border-green-400"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        className="border-green-400"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
          >
                    Next
                </Button>
            </div>
        </div>
    </div >
  );
}
