import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <span className="text-sm text-gray-500">
            Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
        </span>
        <div className="flex gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

export default Pagination;
