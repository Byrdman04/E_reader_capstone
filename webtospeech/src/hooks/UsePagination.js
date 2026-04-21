// hooks/usePagination.js
import { useState, useMemo, useCallback } from 'react';

const LINES_PER_PAGE = 30; // tune this to your preference

export function usePagination(content, scrollRef) {
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToTop = useCallback(() => {
    if (scrollRef?.current) scrollRef.current.scrollTop = 0;
  }, [scrollRef]);


  const pages = useMemo(() => {
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
      result.push(lines.slice(i, i + LINES_PER_PAGE).join('\n'));
    }

    return result;
  }, [content]);

  const goToNext = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
    scrollToTop();
  }, [pages.length, scrollToTop]);

  const goToPrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
    scrollToTop();
  }, [scrollToTop]);
    
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