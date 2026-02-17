import { ReactNode, useState } from 'react';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table';
import Input from './Input';
import { Icons } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import Button from './Button';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyMessage = 'No data available',
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search
  const filteredData = searchable
    ? data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === bVal) return 0;
        const comparison = aVal > bVal ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      {sortedData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Icons.Search className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                      >
                        {column.label}
                        {sortColumn === column.key && (
                          <span className="text-emerald-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {actions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : String(item[column.key] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Results count */}
      {sortedData.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}
    </div>
  );
}
