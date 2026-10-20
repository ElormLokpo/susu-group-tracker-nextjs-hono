
"use client";

import { useMemo, useState } from "react";
import {
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  tableFeatures,
  useTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type SortFn,
} from "@tanstack/react-table";
import {
  LuArrowDown,
  LuArrowDownUp,
  LuArrowUp,
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuLoaderCircle,
  LuRefreshCw,
  LuSearch,
  LuUsers,
} from "react-icons/lu";

export type GroupStatus = "pending" | "active" | "completed";

export interface Group {
  id: string;
  name: string;
  weeklyAmount: string;
  currency: string;
  status: GroupStatus;
  currentWeek: number;
  createdBy: string;
  createdAt: string;
}

export interface GroupsTableProps {
  data?: Group[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const EMPTY_GROUPS: Group[] = [];

const groupFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400";

function formatMoney(amount: string, currency: string): string {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${amount} ${currency}`;
  }

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${amount} ${currency}`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusClasses(status: GroupStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700";
    case "completed":
      return "bg-indigo-50 text-indigo-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
  }
}

function formatStatus(status: GroupStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const amountSortingFn: SortFn<typeof groupFeatures, Group> = (
  rowA,
  rowB,
  columnId,
) => {
  return (
    Number(rowA.getValue(columnId)) -
    Number(rowB.getValue(columnId))
  );
};

const createdAtSortingFn: SortFn<typeof groupFeatures, Group> = (
  rowA,
  rowB,
  columnId,
) => {
  const dateA = new Date(
    String(rowA.getValue(columnId) ?? ""),
  ).getTime();

  const dateB = new Date(
    String(rowB.getValue(columnId) ?? ""),
  ).getTime();

  const safeDateA = Number.isNaN(dateA) ? 0 : dateA;
  const safeDateB = Number.isNaN(dateB) ? 0 : dateB;

  return safeDateA - safeDateB;
};

export default function GroupsTable({
  data = EMPTY_GROUPS,
  isLoading = false,
  error = null,
  onRetry,
}: GroupsTableProps) {
  const safeData = Array.isArray(data) ? data : EMPTY_GROUPS;

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | GroupStatus
  >("all");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredData = useMemo(
    () =>
      safeData.filter(
        (group) =>
          statusFilter === "all" ||
          group.status === statusFilter,
      ),
    [safeData, statusFilter],
  );

  const columns = useMemo<ColumnDef<typeof groupFeatures, Group>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Group",
        cell: ({ row }) => (
          <div className="flex min-w-40 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <LuUsers size={19} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {row.original.name}
              </p>
              <p className="mt-1 truncate text-xs text-slate-400">
                ID: {row.original.id.slice(0, 8)}…
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "weeklyAmount",
        header: "Weekly contribution",
        sortingFn: amountSortingFn,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-semibold tabular-nums text-slate-900">
            {formatMoney(
              row.original.weeklyAmount,
              row.original.currency,
            )}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<GroupStatus>();

          return (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(status)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {formatStatus(status)}
            </span>
          );
        },
      },
      {
        accessorKey: "currentWeek",
        header: "Current week",
        cell: ({ getValue }) => (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Week {getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date created",
        sortingFn: createdAtSortingFn,
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-slate-600">
            {formatDate(String(getValue() ?? ""))}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useTable({
    features: groupFeatures,
    columns,
    data: filteredData,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (updater) => {
      setGlobalFilter((current) =>
        typeof updater === "function"
          ? updater(current)
          : String(updater ?? ""),
      );

      setPagination((current) => ({
        ...current,
        pageIndex: 0,
      }));
    },
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .toLowerCase()
        .trim();

      if (!query) return true;

      const group = row.original;

      return [
        group.name,
        group.id,
        group.status,
        group.currentWeek,
        group.weeklyAmount,
        group.currency,
        group.createdBy,
        group.createdAt,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      );
    },
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const paginationState = table.state.pagination;

  const firstRow =
    totalRows === 0
      ? 0
      : paginationState.pageIndex * paginationState.pageSize + 1;

  const lastRow = Math.min(
    (paginationState.pageIndex + 1) * paginationState.pageSize,
    totalRows,
  );

  return (
    <section className="space-y-5 text-slate-900">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Savings groups</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track your susu groups.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:min-w-64">
              <span className="sr-only">Search groups</span>
              <LuSearch
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={globalFilter}
                onChange={(event) => {
                  setGlobalFilter(event.target.value);
                  setPagination((current) => ({
                    ...current,
                    pageIndex: 0,
                  }));
                }}
                placeholder="Search groups..."
                className={inputClass}
              />
            </label>

            <select
              aria-label="Filter groups by status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as "all" | GroupStatus,
                );
                setPagination((current) => ({
                  ...current,
                  pageIndex: 0,
                }));
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <LuCircleAlert className="mt-0.5 shrink-0" size={19} />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Could not load groups</p>
            <p className="mt-1 break-words text-sm">{error}</p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium hover:bg-red-100"
            >
              <LuRefreshCw size={15} />
              Retry
            </button>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!header.column.getCanSort()}
                            className={`inline-flex items-center gap-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer hover:text-indigo-700"
                                : "cursor-default"
                            }`}
                          >
                            <table.FlexRender header={header} />
                            {header.column.getCanSort() &&
                              (sorted === "asc" ? (
                                <LuArrowUp size={14} />
                              ) : sorted === "desc" ? (
                                <LuArrowDown size={14} />
                              ) : (
                                <LuArrowDownUp
                                  size={14}
                                  className="text-slate-300"
                                />
                              ))}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <LuLoaderCircle
                        size={26}
                        className="animate-spin text-indigo-600"
                      />
                      <p className="text-sm">Loading groups...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Check the error message above and try again.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <LuUsers size={22} />
                      </div>
                      <p className="font-medium text-slate-800">
                        No groups found
                      </p>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        {globalFilter || statusFilter !== "all"
                          ? "Try changing your search or status filter."
                          : "Your savings groups will appear here when available."}
                      </p>
                      {(globalFilter || statusFilter !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setGlobalFilter("");
                            setStatusFilter("all");
                            setPagination((current) => ({
                              ...current,
                              pageIndex: 0,
                            }));
                          }}
                          className="mt-4 text-sm font-medium text-indigo-700 hover:text-indigo-800"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-800">
              {firstRow}–{lastRow}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-800">
              {totalRows}
            </span>{" "}
            groups
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              Rows
              <select
                aria-label="Rows per page"
                value={paginationState.pageSize}
                onChange={(event) =>
                  table.setPageSize(Number(event.target.value))
                }
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <span className="text-sm tabular-nums text-slate-500">
              Page {Math.min(paginationState.pageIndex + 1, Math.max(table.getPageCount(), 1))}{" "}
              of {Math.max(table.getPageCount(), 1)}
            </span>

            <button
              type="button"
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronLeft size={17} />
            </button>

            <button
              type="button"
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
