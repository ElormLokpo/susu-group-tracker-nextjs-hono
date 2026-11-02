
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
    LuPencil,
    LuRefreshCw,
    LuSearch,
    LuTrash2,
    LuWallet,
    LuX,
} from "react-icons/lu";

import type {
    Transaction,
    TransactionFormValues,
    TransactionsTableProps,
    TransactionType,
    UpdateTransactionInput,
} from "../types";


const transactionFeatures = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
});

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500  disabled:opacity-50";

const transactionTypes: TransactionType[] = [
    "contribution",
    "payout",
];

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

function toMinorUnits(amount: string): number {
    const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(amount);

    if (!match) return 0;

    const whole = Number(match[1]);
    const fraction = Number((match[2] ?? "").padEnd(2, "0"));

    return whole * 100 + fraction;
}

// function formatMinorUnits(
//     amount: number,
//     currency: string
// ): string {
//     return formatMoney((amount / 100).toFixed(2), currency);
// }

function initials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const amountSortingFn: SortFn<typeof transactionFeatures, Transaction> = (
    rowA,
    rowB,
    columnId
) => {
    return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId));
}

export default function TransactionsTable({
    data,
    isLoading = false,
    error = null,
    onRetry,
    onUpdate,
    onDelete,
}: TransactionsTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [weekFilter, setWeekFilter] = useState("all");

    const [sorting, setSorting] = useState<SortingState>([
        { id: "week", desc: true },
    ]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [editing, setEditing] = useState<Transaction | null>(null);
    const [deleting, setDeleting] = useState<Transaction | null>(null);

    const [form, setForm] = useState<TransactionFormValues>({
        amount: "",
        currency: "GHS",
        type: "contribution",
        week: "1",
    });

    const [saving, setSaving] = useState(false);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const weeks = useMemo(
        () =>
            [...new Set(data.map((transaction) => transaction.week))].sort(
                (a, b) => a - b
            ),
        [data]
    );

    const filteredData = useMemo(
        () =>
            data.filter((transaction) => {
                const matchesType =
                    typeFilter === "all" || transaction.type === typeFilter;

                const matchesWeek =
                    weekFilter === "all" ||
                    transaction.week === Number(weekFilter);

                return matchesType && matchesWeek;
            }),
        [data, typeFilter, weekFilter]
    );

    const columns = useMemo<ColumnDef<
        typeof transactionFeatures,
        Transaction
    >[]>(
        () => [
            {
                accessorKey: "userName",
                header: "Member",
                cell: ({ row }) => (
                    <div className="flex min-w-40 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                            {initials(row.original.userName)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                                {row.original.userName}
                            </p>
                            <p className="text-xs text-slate-500">
                                Recorded by {row.original.recorderName}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "groupName",
                header: "Savings group",
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium text-slate-700">
                            {row.original.groupName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Week {row.original.week}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: "type",
                header: "Type",
                cell: ({ getValue }) => {
                    const type = String(getValue());
                    const isContribution = type === "contribution";

                    return (
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isContribution
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-violet-50 text-violet-700"
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${isContribution ? "bg-emerald-500" : "bg-violet-500"
                                    }`}
                            />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    );
                },
            },
            {
                accessorKey: "amount",
                header: "Amount",
                sortingFn: amountSortingFn,
                cell: ({ row }) => (
                    <span className="whitespace-nowrap font-semibold tabular-nums text-slate-900">
                        {formatMoney(
                            row.original.amount,
                            row.original.currency
                        )}
                    </span>
                ),
            },
            {
                accessorKey: "week",
                header: "Week",
                cell: ({ getValue }) => (
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Week {getValue<number>()}
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
                            aria-label={`Edit transaction by ${row.original.userName}`}
                            onClick={() => openEdit(row.original)}
                            disabled={!onUpdate}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <LuPencil size={16} />
                        </button>

                        <button
                            type="button"
                            aria-label={`Delete transaction by ${row.original.userName}`}
                            onClick={() => {
                                setActionError(null);
                                setDeleting(row.original);
                            }}
                            disabled={!onDelete}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <LuTrash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [onUpdate, onDelete]
    );

    const table = useTable({
        features: transactionFeatures,
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
                    : String(updater ?? "")
            );
            setPagination((current) => ({ ...current, pageIndex: 0 }));
        },
        onPaginationChange: setPagination,

        globalFilterFn: (row, _columnId, filterValue) => {
            const query = String(filterValue ?? "").toLowerCase().trim();

            if (!query) return true;

            const transaction = row.original;

            return [
                transaction.userName,
                transaction.recorderName,
                transaction.groupName,
                transaction.type,
                transaction.amount,
                transaction.currency,
                transaction.id,
            ].some((value) => value.toLowerCase().includes(query));
        },
    });

    function openEdit(transaction: Transaction) {
        setActionError(null);
        setEditing(transaction);
        setForm({
            amount: transaction.amount,
            currency: transaction.currency,
            type: transaction.type as TransactionType,
            week: String(transaction.week),
        });
    }

    function resetFilters() {
        setGlobalFilter("");
        setTypeFilter("all");
        setWeekFilter("all");
        setPagination((current) => ({ ...current, pageIndex: 0 }));
    }

    async function saveTransaction() {
        if (!editing || !onUpdate) return;

        if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) {
            setActionError(
                "Enter a positive amount with no more than two decimal places."
            );
            return;
        }

        const amountInMinorUnits = toMinorUnits(form.amount);
        const week = Number(form.week);
        const currency = form.currency.trim().toUpperCase();

        if (amountInMinorUnits <= 0) {
            setActionError("Amount must be greater than zero.");
            return;
        }

        if (!Number.isSafeInteger(amountInMinorUnits)) {
            setActionError("Amount is outside the supported range.");
            return;
        }

        if (!Number.isInteger(week) || week < 1) {
            setActionError("Week must be a positive whole number.");
            return;
        }

        if (!/^[A-Z]{3}$/.test(currency)) {
            setActionError("Enter a valid three-letter currency code.");
            return;
        }

        if (!transactionTypes.includes(form.type)) {
            setActionError("Select a valid transaction type.");
            return;
        }

        const values: UpdateTransactionInput = {
            amount: form.amount,
            currency,
            type: form.type,
            week,
        };

        setSaving(true);
        setActionError(null);

        try {
            await onUpdate(editing.id, values);
            setEditing(null);
        } catch {
            setActionError(
                "Could not update this transaction. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        if (!deleting || !onDelete) return;

        setDeletingBusy(true);
        setActionError(null);

        try {
            await onDelete(deleting.id);
            setDeleting(null);
        } catch {
            setActionError(
                "Could not delete this transaction. Please try again."
            );
        } finally {
            setDeletingBusy(false);
        }
    }

    const hasFilters =
        Boolean(globalFilter.trim()) ||
        typeFilter !== "all" ||
        weekFilter !== "all";

    // const contributionCents = data
    //     .filter(
    //         (item) =>
    //             item.type === "contribution" && item.currency === "GHS"
    //     )
    //     .reduce((total, item) => total + toMinorUnits(item.amount), 0);

    // const payoutCents = data
    //     .filter(
    //         (item) => item.type === "payout" && item.currency === "GHS"
    //     )
    //     .reduce((total, item) => total + toMinorUnits(item.amount), 0);

    const rows = table.getRowModel().rows;
    const paginationState = table.state.pagination;
    const totalRows = table.getFilteredRowModel().rows.length;
    const firstRow =
        totalRows === 0
            ? 0
            : paginationState.pageIndex * paginationState.pageSize + 1;
    const lastRow = Math.min(
        (paginationState.pageIndex + 1) * paginationState.pageSize,
        totalRows
    );

    return (
        <section className="space-y-6 text-slate-900">

            <div className="overflow-hidden rounded-3xl  bg-white ">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl  tracking-tight">
                                Transactions
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {data.length}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Monitor contributions and payouts across your savings groups.
                        </p>
                    </div>


                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="relative min-w-0 flex-1">
                            <LuSearch
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={globalFilter}
                                onChange={(event) =>
                                    table.setGlobalFilter(event.target.value)
                                }
                                placeholder="Search members, groups, amounts..."
                                aria-label="Search transactions"
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <select
                                aria-label="Filter by transaction type"
                                value={typeFilter}
                                onChange={(event) => {
                                    setTypeFilter(event.target.value);
                                    setPagination((current) => ({
                                        ...current,
                                        pageIndex: 0,
                                    }));
                                }}
                                className={inputClass}
                            >
                                <option value="all">All types</option>
                                <option value="contribution">Contributions</option>
                                <option value="payout">Payouts</option>
                            </select>

                            <select
                                aria-label="Filter by week"
                                value={weekFilter}
                                onChange={(event) => {
                                    setWeekFilter(event.target.value);
                                    setPagination((current) => ({
                                        ...current,
                                        pageIndex: 0,
                                    }));
                                }}
                                className={inputClass}
                            >
                                <option value="all">All weeks</option>
                                {weeks.map((week) => (
                                    <option key={week} value={String(week)}>
                                        Week {week}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                                <LuX size={16} />
                                Clear
                            </button>
                        )}
                    </div>
                </div>


                {error && (
                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <LuCircleAlert size={23} />
                        </div>
                        <h3 className="font-semibold">
                            Couldn&apos;t load transactions
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            {error}
                        </p>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <LuRefreshCw size={16} />
                                Try again
                            </button>
                        )}
                    </div>
                )}
                {isLoading && (

                    <div
                        className="space-y-4 p-5"
                        aria-label="Loading transactions"
                        aria-busy="true"
                    >
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <LuLoaderCircle className="animate-spin" size={17} />
                            Loading transactions...
                        </div>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex animate-pulse items-center gap-4 py-3"
                            >
                                <div className="h-10 w-10 rounded-full bg-slate-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                                    <div className="h-3 w-1/4 rounded bg-slate-100" />
                                </div>
                                <div className="h-5 w-20 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}
                {rows.length === 0 ? (

                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            {hasFilters ? (
                                <LuSearch size={25} />
                            ) : (
                                <LuWallet size={25} />
                            )}
                        </div>
                        <h3 className="font-semibold">
                            {hasFilters
                                ? "No matching transactions"
                                : "No transactions yet"}
                        </h3>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            {hasFilters
                                ? "Try adjusting your search or clearing your filters."
                                : "When contributions or payouts are recorded, they will appear here."}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    scope="col"
                                                    className="whitespace-nowrap px-5 py-4 font-medium"
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <button
                                                            type="button"
                                                            disabled={!header.column.getCanSort()}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className={`inline-flex items-center gap-2 ${header.column.getCanSort()
                                                                ? "cursor-pointer transition hover:text-indigo-700"
                                                                : "cursor-default"
                                                                }`}
                                                        >
                                                            <table.FlexRender header={header} />

                                                            {header.column.getCanSort() &&
                                                                (header.column.getIsSorted() === "asc" ? (
                                                                    <LuArrowUp size={14} />
                                                                ) : header.column.getIsSorted() === "desc" ? (
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
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((row) => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className="divide-y divide-slate-100 md:hidden">
                            {rows.map(({ original: item }) => (
                                <article key={item.id} className="space-y-4 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                                                {initials(item.userName)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold">
                                                    {item.userName}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {item.groupName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="font-semibold tabular-nums">
                                                {formatMoney(item.amount, item.currency)}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Week {item.week}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.type === "contribution"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-violet-50 text-violet-700"
                                                }`}
                                        >
                                            {item.type.charAt(0).toUpperCase() +
                                                item.type.slice(1)}
                                        </span>

                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(item)}
                                                disabled={!onUpdate}
                                                aria-label="Edit transaction"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-40"
                                            >
                                                <LuPencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActionError(null);
                                                    setDeleting(item);
                                                }}
                                                disabled={!onDelete}
                                                aria-label="Delete transaction"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                            >
                                                <LuTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>


                        <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                <span className="font-medium text-slate-800">
                                    {firstRow}–{lastRow}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-slate-800">
                                    {totalRows}
                                </span>{" "}
                                transactions
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                                <select
                                    aria-label="Rows per page"
                                    value={paginationState.pageSize}
                                    onChange={(event) =>
                                        table.setPageSize(Number(event.target.value))
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-indigo-500"
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size} per page
                                        </option>
                                    ))}
                                </select>

                                <div className="flex items-center gap-2">
                                    <span className="whitespace-nowrap text-sm text-slate-500">
                                        Page {paginationState.pageIndex + 1} of{" "}
                                        {Math.max(table.getPageCount(), 1)}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Previous page"
                                        disabled={!table.getCanPreviousPage()}
                                        onClick={() => table.previousPage()}
                                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <LuChevronLeft size={17} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next page"
                                        disabled={!table.getCanNextPage()}
                                        onClick={() => table.nextPage()}
                                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <LuChevronRight size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>


            {editing && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <button
                        type="button"
                        aria-label="Close edit panel"
                        onClick={() => !saving && setEditing(null)}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                    />

                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-transaction-title"
                        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                    Transaction details
                                </p>
                                <h2
                                    id="edit-transaction-title"
                                    className="mt-1 text-xl font-semibold"
                                >
                                    Edit transaction
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Update permitted transaction fields.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close"
                                disabled={saving}
                                onClick={() => setEditing(null)}
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <LuX size={20} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto p-6">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">Member</p>
                                <p className="mt-1 font-semibold">{editing.userName}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {editing.groupName} · Week {editing.week}
                                </p>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium">Amount</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={form.amount}
                                    onChange={(event) =>
                                        setForm({ ...form, amount: event.target.value })
                                    }
                                    className={inputClass}
                                    placeholder="50.00"
                                />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium">Currency</span>
                                    <input
                                        value={form.currency}
                                        maxLength={3}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                currency: event.target.value.toUpperCase(),
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-sm font-medium">Week</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={form.week}
                                        onChange={(event) =>
                                            setForm({ ...form, week: event.target.value })
                                        }
                                        className={inputClass}
                                    />
                                </label>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium">
                                    Transaction type
                                </span>
                                <select
                                    value={form.type}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            type: event.target.value as TransactionType,
                                        })
                                    }
                                    className={inputClass}
                                >
                                    {transactionTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </label>



                            {actionError && (
                                <p role="alert" className="text-sm text-red-600">
                                    {actionError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 border-t border-slate-100 p-6">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setEditing(null)}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={saving || !onUpdate}
                                onClick={saveTransaction}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving && (
                                    <LuLoaderCircle className="animate-spin" size={16} />
                                )}
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </aside>
                </div>
            )}


            {deleting && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-transaction-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <LuTrash2 size={22} />
                        </div>

                        <h2
                            id="delete-transaction-title"
                            className="text-lg font-semibold"
                        >
                            Delete this transaction?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Delete the{" "}
                            <span className="font-medium text-slate-800">
                                {formatMoney(deleting.amount, deleting.currency)}
                            </span>{" "}
                            {deleting.type} recorded for{" "}
                            <span className="font-medium text-slate-800">
                                {deleting.userName}
                            </span>{" "}
                            in {deleting.groupName}, week {deleting.week}.
                        </p>



                        {actionError && (
                            <p role="alert" className="mt-4 text-sm text-red-600">
                                {actionError}
                            </p>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                disabled={deletingBusy}
                                onClick={() => setDeleting(null)}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deletingBusy || !onDelete}
                                onClick={confirmDelete}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingBusy && (
                                    <LuLoaderCircle className="animate-spin" size={16} />
                                )}
                                {deletingBusy ? "Deleting..." : "Delete transaction"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

