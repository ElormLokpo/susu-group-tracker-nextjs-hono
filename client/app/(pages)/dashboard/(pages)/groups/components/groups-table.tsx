
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
  LuCopy,
  LuLoaderCircle,
  LuPencil,
  LuRefreshCw,
  LuSearch,
  LuTrash2,
  LuUsers,

} from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { EditGroupForm } from "./edit-group-form";


export type GroupStatus = "pending" | "active" | "completed";

export interface Group {
  id: string;
  name: string;
  weeklyAmount: string;
  currency: string;
  status: GroupStatus;
  currentWeek: number;
  inviteLink: string;
  createdBy: string;
  createdAt: string;
}

export interface GroupFormValues {
  id: string;
  name: string;
  weeklyAmount: string;
  currency: string;
  status: GroupStatus;
  currentWeek: string;
}

export type UpdateGroupInput = Omit<GroupFormValues, "currentWeek"> & {
  currentWeek: number;
};

export interface GroupsTableProps {
  data?: Group[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onUpdate?: (id: string, values: UpdateGroupInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
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
  "w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-500";

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
  onUpdate,
  onDelete,
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

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<Group | null>(null);
  const [form, setForm] = useState<GroupFormValues>({
    id: "",
    name: "",
    weeklyAmount: "",
    currency: "GHS",
    status: "pending",
    currentWeek: "1",
  });

  const [deletingBusy, setDeletingBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);



  const handleCopy = async (inviteLink: string) => {

    const value = process.env.NEXT_PUBLIC_ENVIRONMENT === "produciton" ? process.env.NEXT_PUBLIC_CLIENT + "/invite/" + inviteLink : process.env.NEXT_PUBLIC_CLIENT_LOCAL + "/invite/" + inviteLink;


    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };


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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <LuUsers size={14} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-stone-700">
                {row.original.name}
              </p>
              <p className="mt-1 truncate text-xs text-stone-400">
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
          <span className="whitespace-nowrap font-semibold text-sm text-center tabular-nums text-stone-900">
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
              <span className="h-1.5 w-1.5 rounded-full text-sm bg-current" />
              {formatStatus(status)}
            </span>
          );
        },
      },
      {
        accessorKey: "currentWeek",
        header: "Current week",
        cell: ({ getValue }) => (
          <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
            Week {getValue<number>()}
          </span>
        ),
      },

      {
        accessorKey: "inviteLink",
        header: "Invite Link",
        cell: ({ row }) => (
          <span
            onClick={() => handleCopy(row.original.inviteLink)}
            className="whitespace-nowrap hover:underline hover:cursor-pointer  flex items-center gap-1 tabular-nums text-stone-900">

            <p className="truncate text-xs  text-stone-600">
              {copied ? "Copied!" : "Copy link"}
            </p>

            <span>
              <button
                type="button"
                onClick={() => handleCopy(row.original.inviteLink)}
                aria-label={copied ? "Copied" : "Copy link"}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500   "
              >
                {copied ? (
                  <>
                    <IoCheckmarkCircleOutline size={12} />

                  </>
                ) : (
                  <>
                    <LuCopy size={12} />

                  </>
                )}
              </button>
            </span>
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date created",
        sortingFn: createdAtSortingFn,
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-xs text-stone-600">
            {formatDate(String(getValue() ?? ""))}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">Actions</span>,
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <button
              type="button"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => openEdit(row.original)}
            
              className="rounded-lg p-2 text-stone-500 transition hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuPencil size={16} />
            </button>
            <button
              type="button"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => {
                setActionError(null);
                setDeleting(row.original);
              }}
              disabled={!onDelete}
              className="rounded-lg p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuTrash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [ onDelete, copied],
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

  function openEdit(group: Group) {
    setActionError(null);
    setIsEditing(true);
    setForm({
      id: group.id,
      name: group.name,
      weeklyAmount: group.weeklyAmount,
      currency: group.currency,
      status: group.status,
      currentWeek: String(group.currentWeek),
    });
  }



  async function confirmDelete() {
    if (!deleting || !onDelete) return;

    setDeletingBusy(true);
    setActionError(null);
    try {
      await onDelete(deleting.id);
      setDeleting(null);
    } catch {
      setActionError("Could not delete this group. Please try again.");
    } finally {
      setDeletingBusy(false);
    }
  }

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
    <section className=" text-stone-900">
      <div className="rounded-t-2xl  bg-white p-4 sm:p-5">
        <div className="">
          <div className="mb-5">
            <div className="flex  gap-2 items-center mb-1">
              <h2 className="text-lg font-semibold">All Savings groups</h2>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                {data.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Manage and track your susu groups.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <span className="sr-only">Search groups</span>
              <LuSearch
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
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
                className={`${inputClass} pl-10`}
              />
            </div>

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
              className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-indigo-500"
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
            <p className="mt-1 wrap-break-word text-sm">{error}</p>
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



      <div className="overflow-hidden rounded-b-2xl border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 border-collapse text-left">
            <thead className="border-b border-stone-200 bg-stone-50/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!header.column.getCanSort()}
                            className={`inline-flex items-center gap-2 ${header.column.getCanSort()
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
                                  className="text-stone-300"
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

            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center gap-3 text-stone-500">
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
                    className="px-5 py-10 text-center text-sm text-stone-500"
                  >
                    Check the error message above and try again.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                        <LuUsers size={22} />
                      </div>
                      <p className="font-medium text-stone-800">
                        No groups found
                      </p>
                      <p className="mt-1 max-w-sm text-sm text-stone-500">
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
                    className="transition hover:bg-stone-50/70"
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

        <div className="flex flex-col gap-4 border-t border-stone-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {firstRow}–{lastRow}
            </span>{" "}
            of{" "}
            <span className="font-medium text-stone-800">
              {totalRows}
            </span>{" "}
            groups
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-stone-500">
              Rows
              <select
                aria-label="Rows per page"
                value={paginationState.pageSize}
                onChange={(event) =>
                  table.setPageSize(Number(event.target.value))
                }
                className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-700 outline-none focus:border-indigo-500"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <span className="text-sm tabular-nums text-stone-500">
              Page {Math.min(paginationState.pageIndex + 1, Math.max(table.getPageCount(), 1))}{" "}
              of {Math.max(table.getPageCount(), 1)}
            </span>

            <button
              type="button"
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronLeft size={17} />
            </button>

            <button
              type="button"
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close edit panel"
            onClick={() => !saving && setEditing(null)}
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-group-title"
            className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-stone-100 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Group details
                </p>
                <h2 id="edit-group-title" className="mt-1 text-xl font-semibold">
                  Edit savings group
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Update the group settings below.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={saving}
                onClick={() => setEditing(null)}
                className="rounded-xl p-2 text-stone-500 hover:bg-stone-100"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">


              <label className="block space-y-2">
                <span className="text-sm font-medium">Group name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={inputClass.replace("pl-10", "pl-3")}
                  placeholder="e.g. Family Susu"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Weekly contribution</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.weeklyAmount}
                  onChange={(event) => setForm({ ...form, weeklyAmount: event.target.value })}
                  className={inputClass.replace("pl-10", "pl-3")}
                  placeholder="50.00"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Currency</span>
                  <input
                    value={form.currency}
                    maxLength={3}
                    onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })}
                    className={inputClass.replace("pl-10", "pl-3")}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Current week</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.currentWeek}
                    onChange={(event) => setForm({ ...form, currentWeek: event.target.value })}
                    className={inputClass.replace("pl-10", "pl-3")}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as GroupStatus })}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              {actionError && <p role="alert" className="text-sm text-red-600">{actionError}</p>}
            </div>

            <div className="flex gap-3 border-t border-stone-100 p-6">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !onUpdate}
                onClick={saveGroup}D:\code\study-projects\susu-group-tracker\client\app\(pages)\dashboard\(pages)\groups\page.tsx
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <LuLoaderCircle className="animate-spin" size={16} />}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </aside>
        </div>
      )} */}

      {
        isEditing && (
          <>
            <EditGroupForm form={form} onUpdate={onUpdate} setIsEditing={setIsEditing} />
          </>
        )
      }

      {deleting && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-[2px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-group-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <LuTrash2 size={22} />
            </div>
            <h2 id="delete-group-title" className="text-lg font-semibold">
              Delete this savings group?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-stone-800">{deleting.name}</span>?
              This action cannot be undone.
            </p>
            {actionError && <p role="alert" className="mt-4 text-sm text-red-600">{actionError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deletingBusy}
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingBusy || !onDelete}
                onClick={confirmDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingBusy && <LuLoaderCircle className="animate-spin" size={16} />}
                {deletingBusy ? "Deleting..." : "Delete group"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
