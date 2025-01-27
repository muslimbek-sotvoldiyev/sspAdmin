import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Pagination = ({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`p-2 rounded-lg border border-gray-300 ${
          page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'
        }`}
      >
        <ChevronLeftIcon />
      </button>

      <span className="font-bold">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`p-2 rounded-lg border border-gray-300 ${
          page === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'
        }`}
      >
        <ChevronRightIcon />
      </button>

      <select
        className="ml-4 py-2 px-3 border border-gray-300 rounded-md"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>
    </div>
  );
};

export default Pagination;
