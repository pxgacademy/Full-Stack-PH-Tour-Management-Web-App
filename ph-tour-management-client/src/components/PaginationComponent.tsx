import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchParams } from "react-router";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 10,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  //

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (value: number | undefined) => {
    if (value) {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(value));
      setSearchParams(params);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* First page button */}
        <PaginationItem>
          <button
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-label="Go to first page"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "button" : undefined}
            onClick={() => handlePageChange(currentPage === 1 ? undefined : 1)}
          >
            <ChevronFirstIcon size={16} aria-hidden="true" />
          </button>
        </PaginationItem>

        {/* Previous page button */}
        <PaginationItem>
          <button
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "button" : undefined}
            onClick={() => handlePageChange(currentPage === 1 ? undefined : currentPage - 1)}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </button>
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <button
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "button" : undefined}
            onClick={() =>
              handlePageChange(currentPage === totalPages ? undefined : currentPage + 1)
            }
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </button>
        </PaginationItem>

        {/* Last page button */}
        <PaginationItem>
          <button
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-label="Go to last page"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "button" : undefined}
            onClick={() => handlePageChange(currentPage === totalPages ? undefined : totalPages)}
          >
            <ChevronLastIcon size={16} aria-hidden="true" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
