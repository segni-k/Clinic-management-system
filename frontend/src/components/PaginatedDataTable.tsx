import { ReactNode, useState, useEffect } from 'react';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table';
import Input from './Input';
import { Icons } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import Button from './Button';
import { Pagination } from './Pagination';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface PaginatedDataTableProps<T> {
  fetchData: (params: { page: number; per_page: number; search?: string }) => Promise<{
    data: T[];
    meta: PaginationMeta;
  }>;
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
  defaultPerPage?: number;
}

export function PaginatedDataTable<T extends Record<string, unknown>>({
  fetchData,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyMessage = 'No data available',
  actions,
  defaultPerPage = 10,
}: PaginatedDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: defaultPerPage,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    loadData();
  }, [currentPage, perPage, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        page: currentPage,
        per_page: perPage,
        search: searchQuery || undefined,
      });
      setData(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error('Failed to load data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (loading && currentPage === 1) {
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" text="Loading..." />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <Icons.Search className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  {actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => onRowClick?.(item)}
                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
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
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(item)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              totalItems={meta.total}
              itemsPerPage={meta.per_page}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handlePerPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
