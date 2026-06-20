'use client';

import { useCallback } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  }, [currentPage, totalPages, onPageChange]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 3;
    const items = [];
 
    // Previous button
    items.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ color: '#4D44B5' }}
        >
          &laquo;
        </button>
      </li>
    );
 
    // First page
    items.push(
      <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(1)}
          style={currentPage === 1
            ? { backgroundColor: '#4D44B5', borderColor: '#4D44B5', color: '#fff' }
            : { color: '#4D44B5' }}
        >
          1
        </button>
      </li>
    );
 
    // Left ellipsis if needed
    if (currentPage > maxVisiblePages + 1) {
      items.push(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Middle pages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));
 
    if (startPage <= 2) startPage = 2;
    if (endPage >= totalPages - 1) endPage = totalPages - 1;
 
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {  
        items.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(i)}
              style={currentPage === i
                ? { backgroundColor: '#4D44B5', borderColor: '#4D44B5', color: '#fff' }
                : { color: '#4D44B5' }}
            >
              {i}
            </button>
          </li>
        );
      }
    }
 
    // Right ellipsis if needed
    if (currentPage < totalPages - maxVisiblePages) {
      items.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }
 
    // Last page if there is more than 1 page
    if (totalPages > 1) {
      items.push(
        <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageChange(totalPages)}
            style={currentPage === totalPages
              ? { backgroundColor: '#4D44B5', borderColor: '#4D44B5', color: '#fff' }
              : { color: '#4D44B5' }}
          >
            {totalPages}
          </button>
        </li>
      );
    }
 
    // Next button
    items.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ color: '#4D44B5' }}
        >
           &raquo;
        </button>
      </li>
    );

    return items;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination mb-0">
          {renderPagination()}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;