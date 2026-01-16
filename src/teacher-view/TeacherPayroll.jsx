import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Download, Eye, Plus, Filter, Upload, X, Trash2, Edit2, Lock, DollarSign, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';

const TeacherPayroll = ({ teacher }) => {
    // --- State Management ---
    // Initialize with props or default mock data
    const [payrollHistory, setPayrollHistory] = useState(teacher.payroll || []);

    // Filter State
    const [filterYear, setFilterYear] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');

    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    // Temp Data for Verification
    const [tempData, setTempData] = useState(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        id: '',
        month: '',
        year: new Date().getFullYear().toString(),
        basic: '',
        bonus: '0',
        deductions: '0',
        date: new Date().toISOString().split('T')[0],
        status: 'Paid',
        receipt: null,
        receiptUrl: null
    });

    const academicMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    // --- Derived State (Stats & Filtering) ---

    const filteredHistory = useMemo(() => {
        return payrollHistory.filter(record => {
            // Record format example: "October 2025"
            // We need to parse this if we want strict filtering, or just string match
            // The record.month in data is "October 2025" (combined) based on previous code
            // But let's check how we save it. verifyPasswordAndSave does: `${tempData.month} ${tempData.year}`

            const [recMonth, recYear] = record.month.split(' ');

            const matchYear = filterYear === 'All' || recYear === filterYear;
            const matchMonth = filterMonth === 'All' || recMonth === filterMonth;

            return matchYear && matchMonth;
        });
    }, [payrollHistory, filterYear, filterMonth]);

    const stats = useMemo(() => {
        const total = payrollHistory.reduce((acc, curr) => {
            const basic = parseInt(curr.basic.replace(/,/g, '') || 0);
            const bonus = parseInt(curr.bonus.replace(/,/g, '') || 0);
            const ded = parseInt(curr.deductions?.replace(/,/g, '') || 0);
            return acc + (basic + bonus - ded);
        }, 0);

        // Last Salary
        const last = payrollHistory.length > 0 ? payrollHistory[0] : null;
        const lastAmount = last
            ? parseInt(last.basic.replace(/,/g, '')) + parseInt(last.bonus.replace(/,/g, '')) - parseInt(last.deductions?.replace(/,/g, '') || 0)
            : 0;

        return {
            totalPaid: `LKR ${total.toLocaleString()}`,
            lastPaid: last ? `LKR ${lastAmount.toLocaleString()}` : "LKR 0"
        };
    }, [payrollHistory]);


    // --- Actions ---

    const handleDownloadSlip = (record) => {
        const doc = new jsPDF();

        // --- PDF Generation Logic (Same as before) ---
        doc.setFillColor(31, 41, 55);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("PAY SLIP", 105, 25, null, null, "center");

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        let yPos = 60;
        const addLine = (label, value) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${value}`, 80, yPos);
            yPos += 12;
        };

        addLine("Employee Name", teacher.fullName || teacher.firstName);
        addLine("Employee ID", teacher.employeeId || "EMP-001");
        addLine("Designation", teacher.designation || "Lecturer");
        yPos += 5;
        addLine("Pay Period", `${record.month}`);
        addLine("Payment Date", record.date || "N/A");

        yPos += 10;
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        addLine("Basic Salary", `LKR ${record.basic}`);
        addLine("Bonus / Allowances", `LKR ${record.bonus}`);
        addLine("Deductions", `LKR ${record.deductions || 0}`);

        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`NET SALARY: LKR ${parseInt(record.basic.replace(/,/g, '')) + parseInt(record.bonus.replace(/,/g, '')) - parseInt(record.deductions?.replace(/,/g, '') || 0)}`, 20, yPos);

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("This is a system generated payslip.", 105, 280, null, null, "center");

        doc.save(`Payslip_${teacher.firstName}_${record.month}.pdf`);
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this payroll record?")) {
            const newHistory = [...payrollHistory];
            newHistory.splice(index, 1);
            setPayrollHistory(newHistory);
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            id: '',
            month: '',
            year: new Date().getFullYear().toString(),
            basic: teacher.salary || '',
            bonus: '0',
            deductions: '0',
            date: new Date().toISOString().split('T')[0],
            status: 'Paid',
            receipt: null,
            receiptUrl: null
        });
        setShowModal(true);
    };

    const openEditModal = (record, index) => {
        setModalMode('edit');
        const [m, y] = record.month.split(' ');

        setFormData({
            id: index,
            month: m || record.month,
            year: y || new Date().getFullYear().toString(),
            basic: record.basic,
            bonus: record.bonus,
            deductions: record.deductions || '0',
            date: record.date || new Date().toISOString().split('T')[0],
            status: record.status,
            receipt: null,
            receiptUrl: record.receiptUrl
        });
        setShowModal(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setTempData(formData);
        setShowModal(false);
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError('');
    };

    const verifyPasswordAndSave = () => {
        if (passwordInput === 'admin123') {
            const formattedMonth = `${tempData.month} ${tempData.year}`;
            const finalReceiptUrl = tempData.receipt ? URL.createObjectURL(tempData.receipt) : tempData.receiptUrl;

            const newRecord = {
                month: formattedMonth,
                basic: tempData.basic,
                bonus: tempData.bonus,
                deductions: tempData.deductions,
                status: tempData.status,
                date: tempData.date,
                receiptUrl: finalReceiptUrl
            };

            if (modalMode === 'add') {
                setPayrollHistory([newRecord, ...payrollHistory]);
            } else {
                const newHistory = [...payrollHistory];
                newHistory[tempData.id] = newRecord;
                setPayrollHistory(newHistory);
            }
            setShowPasswordModal(false);
            setTempData(null);
        } else {
            setPasswordError("Incorrect Password! Access Denied.");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto flex-1">

                    {/* Last Salary Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 px-6 py-4 rounded-xl text-white shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-300 font-bold uppercase tracking-wider opacity-80">Last Salary Paid</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.lastPaid}</h3>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-full">
                            <CreditCard size={24} className="text-white" />
                        </div>
                    </div>

                    {/* Total Paid Card */}
                    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Salary Paid</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.totalPaid}</h3>
                        </div>
                        <div className="bg-green-50 p-2.5 rounded-full">
                            <DollarSign size={24} className="text-green-600" />
                        </div>
                    </div>

                </div>

                <div className="flex gap-2">
                    <button
                        onClick={openAddModal}
                        className="bg-[#EB8A33] hover:bg-[#d97d2a] text-white px-5 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap h-full"
                    >
                        <Plus size={20} /> Process Payroll
                    </button>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-800">Salary History</h3>
                    </div>

                    {/* FILTERS */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Calendar size={16} className="text-gray-400" />
                            <select
                                className="bg-transparent text-sm outline-none text-gray-600 font-medium cursor-pointer"
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                            >
                                <option value="All">All Years</option>
                                {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                className="bg-transparent text-sm outline-none text-gray-600 font-medium cursor-pointer"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                            >
                                <option value="All">All Months</option>
                                {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Basic Salary</th>
                                <th className="px-6 py-4">Bonuses</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((record, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{record.month}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{record.basic}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">+{record.bonus}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {record.receiptUrl ? (
                                                    <a
                                                        href={record.receiptUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                        title="View Office Receipt"
                                                    >
                                                        <Eye size={18} />
                                                    </a>
                                                ) : (
                                                    <span className="p-2 text-gray-300" title="No Receipt Uploaded"><Eye size={18} /></span>
                                                )}

                                                <button onClick={() => handleDownloadSlip(record)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Download Slip">
                                                    <Download size={18} />
                                                </button>
                                                <button onClick={() => openEditModal(record, i)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">No payroll records found for selected period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FORM MODAL (Keep Existing) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                            <h3 className="font-bold text-gray-800 text-lg">
                                {modalMode === 'add' ? 'Process Salary' : 'Update Payroll'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                    <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })}>
                                        <option value="">-- Month --</option>
                                        {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                                        {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                                <input type="text" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.basic} onChange={e => setFormData({ ...formData, basic: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.bonus} onChange={e => setFormData({ ...formData, bonus: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.deductions} onChange={e => setFormData({ ...formData, deductions: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                                <input type="date" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>

                            {/* Manual Receipt Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Office Receipt (Manual)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50/50">
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={e => setFormData({ ...formData, receipt: e.target.files[0] })}
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Upload size={24} />
                                        <span className="text-xs text-center px-2">
                                            {formData.receipt ? formData.receipt.name : (formData.receiptUrl ? "Update Receipt (File Selected)" : "Click to upload manual receipt photo")}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <button type="submit" className="w-full bg-[#EB8A33] hover:bg-[#d97d2a] text-white py-3 rounded-lg font-bold shadow-sm mt-2">
                                {modalMode === 'add' ? 'Confirm Payment' : 'Update Record'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PASSWORD MODAL */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Verification</h3>
                        <p className="text-sm text-gray-500 mb-6">Enter password to process payroll.</p>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-bold tracking-widest outline-none focus:border-[#EB8A33] mb-2"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            autoFocus
                        />
                        {passwordError && <p className="text-red-500 text-xs font-bold mb-3">{passwordError}</p>}
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={verifyPasswordAndSave} className="flex-1 py-2.5 bg-[#EB8A33] text-white rounded-lg font-bold hover:bg-[#d97d2a]">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPayroll;