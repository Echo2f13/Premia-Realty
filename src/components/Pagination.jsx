import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  hasMore,
  hasPrev,
  onNext,
  onPrev,
  isLoading = false
}) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gold-primary/20">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev || isLoading}
          className="flex items-center gap-2 rounded-full bg-platinum-pearl/10 px-4 py-2 text-sm font-semibold text-platinum-pearl transition hover:bg-platinum-pearl/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-platinum-pearl/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
      </div>

      <div className="text-sm text-platinum-pearl/70">
        Page {currentPage}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNext}
          disabled={!hasMore || isLoading}
          className="flex items-center gap-2 rounded-full bg-platinum-pearl/10 px-4 py-2 text-sm font-semibold text-platinum-pearl transition hover:bg-platinum-pearl/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-platinum-pearl/10"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
