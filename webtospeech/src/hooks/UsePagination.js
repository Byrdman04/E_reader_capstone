// hooks/usePagination.js
import { useState, useMemo } from 'react';

const LINES_PER_PAGE = 30; // tune this to your preference

export function usePagination(content) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
      result.push(lines.slice(i, i + LINES_PER_PAGE).join('\n'));
    }

    return result;
  }, [content]);

  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, pages.length - 1), document.getElementsByClassName("main-content")[0].scrollTop = 0);
  const goToPrev = () => setCurrentPage((p) => Math.max(p - 1, 0), document.getElementsByClassName("main-content")[0].scrollTop = 0);
  const goToPage = (n) => setCurrentPage(n);

  return {
    currentPage,
    totalPages: pages.length,
    pageContent: pages[currentPage] ?? '',
    goToNext,
    goToPrev,
    goToPage,
  };
}