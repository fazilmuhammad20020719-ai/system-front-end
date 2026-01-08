import { BookOpen, MoreVertical, Edit, Trash2, Clock, Users, Layers, Eye } from 'lucide-react';

const ProgramGrid = ({ programs, onEdit, onDelete, onView }) => {

    if (programs.length === 0) {
        return (
            <div className="text-center py-12">
                <Layers size={48} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400">No programs found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${program.color}`}>
                                <BookOpen size={24} />
                            </div>
                            <div className="dropdown relative">
                                <button className="text-gray-300 hover:text-gray-600 p-1">
                                    <MoreVertical size={20} />
                                </button>
                                {/* Action Buttons Overlay */}
                                <div className="absolute right-0 top-0 flex flex-col gap-1 bg-white shadow-lg border border-gray-100 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => onView(program)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Eye size={16} /></button>
                                    <button onClick={() => onEdit(program)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(program.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-1">{program.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <span className="font-medium text-gray-400">Head:</span> {program.head}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Clock size={14} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Duration</p>
                                    <p className="text-sm font-semibold text-gray-700">{program.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><Users size={14} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Students</p>
                                    <p className="text-sm font-semibold text-gray-700">{program.students}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {program.status}
                            </span>
                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                Fees: {program.fees}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgramGrid;
