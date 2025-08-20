export function getPagination(
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] {
  const pages: (number | string)[] = [];

  const startPage = Math.max(1, currentPage - delta);
  const endPage = Math.min(totalPages, currentPage + delta);

  // first page
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  // around current page
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
}
