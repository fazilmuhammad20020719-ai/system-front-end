import { CreditCard, Download } from 'lucide-react';

const ViewStudentFees = ({ fees }) => {
    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Pending Dues</p>
                    <h3 className="text-2xl font-bold text-red-700 mt-1">{fees.pending}</h3>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Total Paid</p>
                    <h3 className="text-2xl font-bold text-green-700 mt-1">{fees.paid}</h3>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <CreditCard className="text-[#EB8A33]" size={20} />
                    <h3 className="font-bold text-gray-800">Fee Payment History</h3>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Month</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {fees.history.map((record, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">{record.id}</td>
                                <td className="px-6 py-4 text-gray-600">{record.month}</td>
                                <td className="px-6 py-4 text-gray-800 font-medium">{record.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-[#EB8A33] transition-colors">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudentFees;