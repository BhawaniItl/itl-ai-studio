import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  width?: number;
  pinned?: "left" | "right";
  filterable?: boolean;
  hidden?: boolean;
  csv?: (row: T) => string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pageSize?: number;
  getRowId: (row: T) => string;
  selectable?: boolean;
  onExportCsv?: (rows: T[]) => void;
  bulkActions?: (selected: T[]) => React.ReactNode;
}

/**
 * Enterprise data table — sort, search, column visibility, pagination,
 * bulk selection, CSV export. Fully client-side; wire server pagination later.
 */
export function DataTable<T>({
  data,
  columns,
  loading,
  emptyState,
  pageSize = 10,
  getRowId,
  selectable,
  bulkActions,
  onExportCsv,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const [hidden, setHidden] = useState<Set<string>>(
    new Set(columns.filter((c) => c.hidden).map((c) => c.id)),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visibleCols = columns.filter((c) => !hidden.has(c.id));

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => String(c.accessor(row) ?? "").toLowerCase().includes(q)),
    );
  }, [data, columns, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return filtered;
    const arr = [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (sort.dir === "asc" ? 1 : -1);
    });
    return arr;
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(id: string) {
    setSort((prev) =>
      !prev || prev.id !== id
        ? { id, dir: "asc" }
        : prev.dir === "asc"
          ? { id, dir: "desc" }
          : null,
    );
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const cols = visibleCols;
    const header = cols.map((c) => `"${c.header}"`).join(",");
    const lines = sorted.map((r) =>
      cols.map((c) => `"${(c.csv?.(r) ?? String(c.accessor(r) ?? "")).replace(/"/g, '""')}"`).join(","),
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onExportCsv?.(sorted);
  }

  const selectedRows = data.filter((r) => selected.has(getRowId(r)));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            className="h-9 pl-9"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="space-y-1.5">
              {columns.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!hidden.has(c.id)}
                    onCheckedChange={(v) => {
                      const next = new Set(hidden);
                      if (v) next.delete(c.id);
                      else next.add(c.id);
                      setHidden(next);
                    }}
                  />
                  {c.header}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" /> CSV
        </Button>
      </div>

      {selectable && selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-primary/5 px-3 py-2 text-sm">
          <span>{selected.size} selected</span>
          <div className="flex items-center gap-1.5">{bulkActions?.(selectedRows)}</div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {selectable && (
                  <th className="w-10 px-3 py-3">
                    <Checkbox
                      checked={pageRows.length > 0 && pageRows.every((r) => selected.has(getRowId(r)))}
                      onCheckedChange={(v) => {
                        const next = new Set(selected);
                        pageRows.forEach((r) => {
                          if (v) next.add(getRowId(r));
                          else next.delete(getRowId(r));
                        });
                        setSelected(next);
                      }}
                    />
                  </th>
                )}
                {visibleCols.map((c) => (
                  <th key={c.id} className="px-3 py-3 text-left font-semibold">
                    <button
                      className={cn(
                        "inline-flex items-center gap-1",
                        c.sortValue && "cursor-pointer hover:text-foreground",
                      )}
                      onClick={() => c.sortValue && toggleSort(c.id)}
                    >
                      {c.header}
                      {sort?.id === c.id ? (
                        sort.dir === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : null}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40">
                    {visibleCols.map((c) => (
                      <td key={c.id} className="px-3 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={visibleCols.length + (selectable ? 1 : 0)} className="px-3 py-16 text-center text-sm text-muted-foreground">
                    {emptyState ?? "No results."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <tr key={id} className="border-t border-border/40 hover:bg-secondary/30">
                      {selectable && (
                        <td className="px-3 py-3">
                          <Checkbox checked={selected.has(id)} onCheckedChange={() => toggleRow(id)} />
                        </td>
                      )}
                      {visibleCols.map((c) => (
                        <td key={c.id} className="px-3 py-3 align-middle">
                          {c.accessor(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
