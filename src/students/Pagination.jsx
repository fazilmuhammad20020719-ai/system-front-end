import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => (
    <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">Showing data entries</span>
        <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
    </div>
);

export default Pagination;
