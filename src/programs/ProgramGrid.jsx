import React from 'react';
import { BookOpen, Clock, Users, Eye, Edit, Trash2, Layers } from 'lucide-react';

const ProgramGrid = ({ programs, onEdit, onDelete, onView }) => {

    if (programs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <Layers size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No programs found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group flex flex-col justify-between">

                    {/* Card Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${program.color || 'bg-blue-100 text-blue-600'}`}>
                                <BookOpen size={24} />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {program.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{program.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <span className="font-medium text-gray-400">Head:</span> {program.head}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Duration</p>
                                    <p className="text-sm font-semibold text-gray-700">{program.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Students</p>
                                    <p className="text-sm font-semibold text-gray-700">{program.students}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Actions (Footer) - Eye, Edit, Delete Icons */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-xl">
                        <span className="text-xs font-medium text-gray-500">
                            Fees: <span className="text-gray-800 font-semibold">{program.fees}</span>
                        </span>

                        <div className="flex items-center gap-1">
                            {/* View / Eye Icon */}
                            <button
                                onClick={() => onView(program)}
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                title="View Details"
                            >
                                <Eye size={18} />
                            </button>

                            {/* Edit Icon */}
                            <button
                                onClick={() => onEdit(program)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Program"
                            >
                                <Edit size={18} />
                            </button>

                            {/* Delete Icon */}
                            <button
                                onClick={() => onDelete(program.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Program"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ProgramGrid;