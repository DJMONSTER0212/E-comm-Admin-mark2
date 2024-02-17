import React, { useEffect, useState, useMemo, Suspense } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@/app/_conf/hooks/use-debounce";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/_components/ui/table";
import DataTablePagination from "./data-table-pagignation";
import DataTableToolbar from "./data-table-toolbar";
import DataTableRowSelectOperations from "./data-table-row-select-options";

const DataTableStructure = ({ columns, data, pageCount, filterableColumns = [], searchableColumns = [], rangeableColumns = [], selectOperations = [], tableOperations }) => {
    // Router >>>>>>>>>>>>>>>>>>>>>>
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // Function to create url query string >>>>>>>>>>>>>>>>>>>>>>
    const createQueryString = (params) => {
        const newSearchParams = new URLSearchParams(searchParams?.toString());
        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, String(value));
            }
        }
        return newSearchParams.toString();
    };
    // Set default or url param for table  >>>>>>>>>>>>>>>>>>>>>>
    const page = searchParams?.get("page") ?? "1";
    const per_page = searchParams?.get("per_page") ?? "20";
    // Set sort column and type
    const sort = searchParams?.get("sort");
    const [column, order] = sort?.split(".") ?? [];
    // States for table >>>>>>>>>>>>>>>>>>>>>>
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnFilters, setColumnFilters] = useState(() => {
        let appliedFilters = [];
        for (const key of searchParams.keys()) {
            if (searchableColumns.find((column) => column.id === key)) {
                appliedFilters = [
                    ...appliedFilters,
                    {
                        id: key,
                        value: searchParams.get(key)
                    }
                ]
            }
            if (filterableColumns.find((column) => column.id === key)) {
                appliedFilters = [
                    ...appliedFilters,
                    {
                        id: key,
                        value: searchParams.get(key).split('.')
                    }
                ]
            }
            if (rangeableColumns.find((column) => column.id === key)) {
                appliedFilters = [
                    ...appliedFilters,
                    {
                        id: key,
                        value: searchParams.get(key).split('.')
                    }
                ]
            }
        }
        return appliedFilters;
    });
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: Number(page) - 1,
        pageSize: Number(per_page),
    });
    // Set page size and page index >>>>>>>>>>>>>>>>>>>>>>
    const pagination = useMemo(() => {
        return {
            pageIndex,
            pageSize,
        };
    }, [pageIndex, pageSize]);

    useEffect(() => {
        setPagination({
            pageIndex: Number(page) - 1,
            pageSize: Number(per_page),
        });
    }, [page, per_page]);

    useEffect(() => {
        router.push(
            `${pathname}?${createQueryString({
                page: pageIndex + 1,
                per_page: pageSize,
            })}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize]);
    // Set sorting >>>>>>>>>>>>>>>>>>>>>>
    const [sorting, setSorting] = useState([
        {
            id: column ?? "",
            desc: order === "desc",
        },
    ]);

    useEffect(() => {
        router.push(
            `${pathname}?${createQueryString({
                page,
                per_page: pageSize,
                sort: sorting[0]?.id
                    ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
                    : null,
            })}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);
    // Set searchable column filter >>>>>>>>>>>>>>>>>>>>>>
    const debouncedSearchableColumnFilters = JSON.parse(
        useDebounce(
            JSON.stringify(
                columnFilters.filter((filter) => {
                    return searchableColumns.find((column) => column.id === filter.id);
                })
            ),
            500
        )
    );

    useEffect(() => {
        for (const column of debouncedSearchableColumnFilters) {
            if (typeof column.value === "string") {
                router.push(
                    `${pathname}?${createQueryString({
                        page: 1,
                        per_page: pageSize,
                        [column.id]: typeof column.value === "string" ? column.value : null,
                    })}`
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(debouncedSearchableColumnFilters)]);
    // Set filterable column filter >>>>>>>>>>>>>>>>>>>>>>
    const filterableColumnFilters = columnFilters.filter((filter) => {
        return filterableColumns.find((column) => column.id === filter.id);
    });
    useEffect(() => {
        for (const column of filterableColumnFilters) {
            if (typeof column.value === "object" && Array.isArray(column.value)) {
                router.push(
                    `${pathname}?${createQueryString({
                        page: 1,
                        per_page: pageSize,
                        [column.id]: column.value.join("."),
                    })}`
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filterableColumnFilters)]);
    // Set rangeable column filter >>>>>>>>>>>>>>>>>>>>>>
    const rangeableColumnFilters = columnFilters.filter((filter) => {
        return rangeableColumns.find((column) => column.id === filter.id);
    });
    useEffect(() => {
        for (const column of rangeableColumnFilters) {
            if (typeof column.value === "object" && Array.isArray(column.value)) {
                router.push(
                    `${pathname}?${createQueryString({
                        page: 1,
                        per_page: pageSize,
                        [column.id]: column.value.join("."),
                    })}`
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(rangeableColumnFilters)]);
    // Remove keys from url when user removes filter or reset
    useEffect(() => {
        const keysToBeRemoved = {}
        for (const key of searchParams.keys()) {
            if (
                [...filterableColumns, ...searchableColumns, ...rangeableColumns].find((column) => column.id === key) &&
                !columnFilters.find((column) => column.id === key)
            ) {
                keysToBeRemoved[key] = null;
            }
        }
        if (Object.keys(keysToBeRemoved).length > 0) {
            router.push(
                `${pathname}?${createQueryString({
                    page: 1,
                    per_page: pageSize,
                    ...keysToBeRemoved,
                })}`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters])
    // Tanstack Table
    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return (
        <div className="w-full space-y-4 overflow-auto">
            <DataTableToolbar
                table={table}
                filterableColumns={filterableColumns}
                searchableColumns={searchableColumns}
                rangeableColumns={rangeableColumns}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                tableOperations={tableOperations}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className='data-[state=selected]:bg-muted/50'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="h-15 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
            <DataTableRowSelectOperations table={table} selectOperations={selectOperations} />
        </div>
    );
}


const DataTable = (props) => {
    return <Suspense><DataTableStructure {...props} /></Suspense>
}

export default DataTable;
