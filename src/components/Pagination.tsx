interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage 
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={onPrevPage} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Předchozí
      </button>
      
      <span className="pagination-info">
        Strana {currentPage} z {totalPages}
      </span>
      
      <button 
        onClick={onNextPage} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Další
      </button>
    </div>
  );
};