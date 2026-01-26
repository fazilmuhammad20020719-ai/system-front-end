// src/exams/ResultsLog.jsx
import { Filter, Download, Save } from 'lucide-react';

const ResultsLog = () => {
    // Mock Data
    const results = [
        { id: 101, student: 'Ahmed Fazil', marks: 85, grade: 'A', status: 'Pass' },
        { id: 102, student: 'Mohamed Nazeer', marks: 32, grade: 'F', status: 'Fail' },
        { id: 103, student: 'Sadam Hussain', marks: 78, grade: 'B', status: 'Pass' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            {/* Filters Header */}
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select className="bg-transparent text-sm font-medium outline-none text-slate-600">
                            <option>Select Program</option>
                            <option>Diploma in Arabic</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                        <select className="bg-transparent text-sm font-medium outline-none text-slate-600">
                            <option>Select Exam</option>
                            <option>Mid-Term Arabic</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-bold">
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Obtained Marks</th>
                            <th className="px-6 py-4">Grade</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {results.map((row) => (
                            <tr key={row.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-700">{row.student}</td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        defaultValue={row.marks}
                                        className="w-20 px-2 py-1 border border-slate-200 rounded text-center font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <span className="text-slate-400 text-sm ml-1">/ 100</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600">{row.grade}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${row.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsLog;
