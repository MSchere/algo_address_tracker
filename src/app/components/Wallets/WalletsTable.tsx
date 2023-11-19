"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$components/ui/table";
import { type WalletStatus } from "$src/lib/types/wallet.types";
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
import { ArrowUpDown, ExternalLink, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CopyButton from "../utils/CopyButton";

interface Props {
    walletStatuses: WalletStatus[];
}

export default function WalletsTable({ walletStatuses: tableRows }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const rankingColumns: ColumnDef<WalletStatus>[] = [
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <span className="max-w-[200px] overflow-hidden text-ellipsis">{row.original.address}</span>
                    <CopyButton value={row.original.address} />
                    <a
                        className="pt-[2px]"
                        href={`https://testnet.algoexplorer.io/address/${row.original.address}`}
                        target="_blank"
                    >
                        <ExternalLink width={16} height={16} />
                    </a>
                </div>
            ),
        },
        {
            accessorKey: "balance",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Balance
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="ml-4">{formatBalance(row.original.balance)}</div>,
        },
        {
            accessorKey: "minutelyChange",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        1m
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const positionChange = row.original.minutelyChange;
                return (
                    <span
                        className="ml-4"
                        style={
                            positionChange > 0 ? { color: "#27951D" } : positionChange < 0 ? { color: "#E12222" } : {}
                        }
                    >
                        {formatPercentage(row.original.minutelyChange)}
                    </span>
                );
            },
        },
        {
            accessorKey: "hourlyChange",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        1h
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const positionChange = row.original.minutelyChange;
                return (
                    <span
                        className="ml-4"
                        style={
                            positionChange > 0 ? { color: "#27951D" } : positionChange < 0 ? { color: "#E12222" } : {}
                        }
                    >
                        {formatPercentage(row.original.hourlyChange)}
                    </span>
                );
            },
        },
        {
            accessorKey: "dailyChange",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        1d
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const positionChange = row.original.minutelyChange;
                return (
                    <span
                        className="ml-4"
                        style={
                            positionChange > 0 ? { color: "#27951D" } : positionChange < 0 ? { color: "#E12222" } : {}
                        }
                    >
                        {formatPercentage(row.original.dailyChange)}
                    </span>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Updated
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div className="ml-4">{row.original.updatedAt.toLocaleString()}</div>;
            },
        },
    ];

    function formatBalance(value: bigint): string {
        const str = value.toString();
        const sliced = `${str.slice(0, -6)}.${str.slice(-6)}`;
        return Number(sliced).toFixed(2);
    }

    function formatPercentage(value: number): string {
        let formattedValue = "";
        if (!value ?? value === 0) formattedValue = "0.0%";
        if (value >= 100) formattedValue = "+99.9%";
        if (value < 100) {
            const fixedValue = value.toFixed(1);
            formattedValue = value > 0 ? `+${fixedValue}%` : `${fixedValue}%`;
        }
        return formattedValue;
    }

    const table = useReactTable({
        data: tableRows,
        columns: rankingColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <section className="flex w-full flex-1 flex-col">
            <div className="relative flex items-center py-4 ">
                <Search className="absolute left-4" width={16} height={16} />
                <Input
                    placeholder="search address..."
                    value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("address")?.setFilterValue(event.target.value)}
                    className="form-input max-w-[220px] pl-12 text-base text-primary"
                />
            </div>
            <div className="min-h-[580px] rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={rankingColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </section>
    );
}
