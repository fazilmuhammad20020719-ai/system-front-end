import React from 'react';
import { Edit2, Trash2, Calendar, Search } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { formatJuzDate } from './hifzHelpers';

const StudentTable = ({ filteredTable, tableSearch, setTableSearch, openUpdateModal, handleDeleteStudent, getCompletedJuzs, getRunningJuzs }) => {
    return (
        <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 uppercase">Tracked Students</h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH TRACKED LIST..."
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all uppercase"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase text-left">
                            <tr>
                                <th className="px-5 py-3">Student</th>
                                <th className="px-5 py-3 text-center">Total Completed</th>
                                <th className="px-5 py-3">Current Running</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase">
                            {filteredTable.map(student => {
                                const completedCount = getCompletedJuzs(student.completed_juzs).length;
                                const runningList = getRunningJuzs(student.current_juz);
                                return (
                                    <tr key={student.tracker_id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-sm">{student.student_name.toUpperCase()}</p>
                                            <p className="text-xs text-gray-400">{String(student.student_id).toUpperCase()}</p>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center">
                                                <ProgressRing value={completedCount} />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            {runningList.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {runningList.map(juz => (
                                                        <div key={juz.num} className="flex flex-col">
                                                            <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-md font-bold text-xs w-max">JUZ {juz.num}</span>
                                                            {juz.start && <span className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5"><Calendar size={8} /> {formatJuzDate(juz.start)}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <span className="text-gray-400">NONE</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                                            <button onClick={() => openUpdateModal(student)} className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-100 inline-flex items-center gap-2 uppercase">
                                                <Edit2 size={14} /> Update Progress
                                            </button>
                                            <button onClick={() => handleDeleteStudent(student.student_id, student.student_name)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors" title="Remove from Tracker">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredTable.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500 uppercase">No students assigned yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default StudentTable;
