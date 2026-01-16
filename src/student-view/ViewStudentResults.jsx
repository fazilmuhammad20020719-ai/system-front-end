import { Award } from 'lucide-react';

const ViewStudentResults = ({ results }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Award className="text-green-600" size={20} />
                <h3 className="font-bold text-gray-800">Examination Results</h3>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <th className="px-6 py-4">Exam Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Grade</th>
                        <th className="px-6 py-4">Percentage</th>
                        <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {results.map((res, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-medium text-gray-900">{res.exam}</td>
                            <td className="px-6 py-4 text-gray-600">{res.date}</td>
                            <td className="px-6 py-4 text-green-600 font-bold">{res.grade}</td>
                            <td className="px-6 py-4 text-gray-600">{res.percentage}</td>
                            <td className="px-6 py-4 text-right">
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                    {res.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewStudentResults;