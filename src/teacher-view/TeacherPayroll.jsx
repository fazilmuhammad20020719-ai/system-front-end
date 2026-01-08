import { CreditCard } from 'lucide-react';

const TeacherPayroll = ({ teacher }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl text-white shadow-lg flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-300 font-medium opacity-80">Current Basic Salary</p>
                    <h2 className="text-3xl font-bold mt-1">LKR {teacher.salary}</h2>
                </div>
                <div className="bg-white/10 p-3 rounded-full"><CreditCard size={32} /></div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-700">Salary History</div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-3">Month</th>
                            <th className="px-6 py-3">Basic</th>
                            <th className="px-6 py-3">Bonus</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Slip</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teacher.payroll.map((pay, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{pay.month}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{pay.basic}</td>
                                <td className="px-6 py-4 text-sm text-green-600">{pay.bonus}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">PAID</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-blue-500 hover:underline text-xs font-bold">Download</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherPayroll;