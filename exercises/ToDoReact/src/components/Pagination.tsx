import React from "react";
import GorgeousButton from "./GorgeousButton";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  onPageChange,
}) => {
  const itemsPerPage = 5; // Default items per page
  const startItem = total ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = total ? Math.min(currentPage * itemsPerPage, total) : 0;

  return (
    <div className="flex items-center justify-between p-4 bg-amber-900 border-t border-amber-700">
      {total && (
        <div className="text-amber-200 text-sm">
          Showing {startItem}-{endItem} of {total} tasks
        </div>
      )}

      <div className="flex gap-2 ml-auto">
        <GorgeousButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}   
        >
          Previous
        </GorgeousButton>

        <span className="px-2 py-2.5 bg-amber-600 text-white rounded-lg">
          {currentPage} of {totalPages}
        </span>

        <GorgeousButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </GorgeousButton>
      </div>
    </div>
  );
};

export default Pagination;
