"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$components/ui/table";
import { parseBalance } from "$lib/utils";
import { type WalletSnapshot } from "@prisma/client";
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
import Image from "next/image";
import { useState } from "react";
import AddressForm from "../AddressForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CopyButton from "../utils/CopyButton";

interface Props {
    WalletSnapshots: WalletSnapshot[];
}

export default function WalletsTable({ WalletSnapshots: tableRows }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const rankingColumns: ColumnDef<WalletSnapshot>[] = [
        {
            accessorKey: "walletAddress",
            header: "Address",
            cell: ({ row }) => {
                const address = row.original.walletAddress;
                return (
                    <div className="flex gap-2">
                        <span className="max-w-[200px] overflow-hidden text-ellipsis text-teal">{address}</span>
                        <CopyButton value={address} />
                        <a
                            className="pt-[2px]"
                            href={`https://testnet.algoexplorer.io/address/${address}`}
                            target="_blank"
                        >
                            <ExternalLink width={16} height={16} />
                        </a>
                    </div>
                );
            },
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
            cell: ({ row }) => (
                <div className="ml-4 flex gap-1">
                    <Image src={"/icons/algo.svg"} width={12} height={12} alt="" />
                    {parseBalance(row.original.balance).toFixed(2)}
                </div>
            ),
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
                const change = row.original.minutelyChange;
                return (
                    <span
                        className="ml-4 flex gap-1"
                        style={change > 0 ? { color: "#27951D" } : change < 0 ? { color: "#E12222" } : {}}
                    >
                        <ChangeIcon change={change} />
                        {formatPercentage(change)}{" "}
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
                const change = row.original.hourlyChange;
                return (
                    <span
                        className="ml-4 flex gap-1"
                        style={change > 0 ? { color: "#27951D" } : change < 0 ? { color: "#E12222" } : {}}
                    >
                        <ChangeIcon change={change} />
                        {formatPercentage(change)}{" "}
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
                const change = row.original.dailyChange;
                return (
                    <span
                        className="ml-4 flex gap-1"
                        style={change > 0 ? { color: "#27951D" } : change < 0 ? { color: "#E12222" } : {}}
                    >
                        <ChangeIcon change={change} />
                        {formatPercentage(change)}
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
                return <div className="ml-4">{row.original.createdAt.toLocaleString()}</div>;
            },
        },
    ];

    function ChangeIcon({ change }: { change: number }) {
        return (
            <Image
                src={
                    change > 0
                        ? "/icons/triangle-green.svg"
                        : change < 0
                          ? "/icons/triangle-red.svg"
                          : "/icons/equal.svg"
                }
                width={8}
                height={8}
                alt=""
            />
        );
    }

    function formatPercentage(value: number): string {
        const decimals = 4;
        if (!value ?? value === 0) return `${(0).toFixed(decimals)}%`;
        const fixedValue = value.toFixed(decimals);
        return value > 0 ? `+${fixedValue}%` : `${fixedValue}%`;
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
        <section className="flex w-full flex-col">
            <div className="flex gap-0 flex-col sm:flex-row sm:gap-4">
                <div className="relative flex  items-center pb-4">
                    <Search className="absolute left-4" width={16} height={16} />
                    <Input
                        placeholder="search address..."
                        value={(table.getColumn("walletAddress")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("walletAddress")?.setFilterValue(event.target.value)}
                        className="w-[220px] bg-muted pl-12 text-primary"
                    />
                </div>
                <div className="pb-4 w-full">
                    <AddressForm />
                </div>
            </div>
            <div className="border-t-2 h-[580px]">
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
