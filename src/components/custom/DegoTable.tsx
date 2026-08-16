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
  /**
   * Optional extra controls (filters, switchers, ...) rendered in the top bar
   * next to the search box. Omit it and the top bar looks exactly as before.
   */
  toolbar?: React.ReactNode;
}

export function DegoTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onAddData,
  placeholder = "Search...",
  toolbar,
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
    <div className="w-full space-y-4 pt-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={placeholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="
              pl-10 h-10
              bg-white
              border border-gray-200
              rounded-lg
              focus:ring-2 focus:ring-blue-400/50
              focus:border-blue-400
              transition-all
              text-sm
            "
            />
          </div>

          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>

        {onAddData && (
          <CustomButton
            onClick={onAddData}
            size="sm"
            className="
              bg-(--color-primary) hover:bg-(--color-primary-dark)
              text-white
              rounded-lg
              transition-all
              cursor-pointer
            "
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add New
          </CustomButton>
        )}
      </div>

      {/* Table container */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <Table>
          {/* Header */}
          <TableHeader className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-gray-100 transition-colors"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={`
                    border-b border-gray-100
                    transition-all duration-200
                    hover:bg-blue-50/40
                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400 text-sm"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        {/* Page size */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="font-medium">Rows per page</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-20 border border-gray-200 rounded-lg text-sm">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              size="sm"
              className="bg-(--color-primary) hover:to-blue-700 text-white rounded-lg transition-all"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
