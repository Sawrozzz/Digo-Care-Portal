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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });
  const memoColumn = useMemo(() => columns, [columns]);
  const memoData = useMemo(() => data, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoData,
    columns: memoColumn,
    state: { sorting, rowSelection, columnFilters, pagination },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full space-y-2 pt-2">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="
              pl-9 h-9
              bg-white
              border border-(--border-color)
              focus:ring-2 focus:ring-(--color-primary-soft)
              focus:border-(--color-primary)
            "
          />
        </div>

        <CustomButton
          onClick={onAddData}
          size="sm"
          className="
            bg-(--color-primary)
            hover:opacity-90
            text-white
          "
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Add New
        </CustomButton>
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-(--border-color) bg-white overflow-hidden">
        <Table>
          {/* Header */}
          <TableHeader className="bg-[#f9fafb]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
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

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="
                    bg-white
        border border-(--border-color)
        rounded-xl
        p-4
        hover:shadow-sm
        transition
                  "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center text-gray-500"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        {/* Page size */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Rows per page
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-20 border border-(--border-color)">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 30, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="border-(--border-color)"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            size="sm"
            className="bg-(--color-primary) text-white hover:opacity-90"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
