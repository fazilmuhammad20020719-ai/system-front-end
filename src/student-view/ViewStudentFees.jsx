import { useState } from 'react';
import { CreditCard, Download, Eye, Plus, Filter, Upload, X, Trash2, Edit2, Lock } from 'lucide-react';
import jsPDF from 'jspdf';

const ViewStudentFees = ({ fees: initialFees }) => {
    // --- State Management ---
    const [fees, setFees] = useState(initialFees || {
        pending: "Rs. 15,000",
        paid: "Rs. 45,000",
        history: []
    });

    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [filterStatus, setFilterStatus] = useState('All');

    // Temp Data
    const [tempPaymentData, setTempPaymentData] = useState(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        id: '',
        month: '',
        year: new Date().getFullYear().toString(), // Default to current year
        amount: '',
        date: '',
        receipt: null,
        receiptUrl: null,
        status: 'Paid'
    });

    const academicMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Generate last 5 years for selection
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

    // --- Actions ---

    const handleDownloadReceipt = (record) => {
        const doc = new jsPDF();

        doc.setFillColor(235, 138, 51);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("OFFICIAL PAYMENT RECEIPT", 105, 25, null, null, "center");

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        let yPos = 60;
        const addLine = (label, value) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`${value}`, 80, yPos);
            yPos += 15;
        };

        addLine("Invoice ID", record.id);
        addLine("Month & Year", `${record.month} ${record.year}`); // Included Year
        addLine("Payment Date", record.date);
        addLine("Amount Paid", record.amount);
        addLine("Status", "PAID");

        doc.setLineWidth(0.5);
        doc.line(20, 140, 190, 140);
        doc.setFontSize(10);
        doc.text("Authorized Signature & System Generated Stamp", 105, 150, null, null, "center");

        doc.save(`Receipt_${record.id}.pdf`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this payment record permanently?")) {
            setFees(prev => ({
                ...prev,
                history: prev.history.filter(rec => rec.id !== id)
            }));
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            id: '',
            month: '',
            year: new Date().getFullYear().toString(),
            amount: '',
            date: '',
            receipt: null,
            receiptUrl: null,
            status: 'Paid'
        });
        setShowModal(true);
    };

    const openEditModal = (record) => {
        setModalMode('edit');
        setFormData({ ...record, receipt: null });
        setShowModal(true);
    };

    // --- Form & Password ---

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.month || !formData.year || !formData.amount) {
            alert("Please fill in required fields (Month, Year, Amount).");
            return;
        }
        // If status is Paid, date is required
        if (formData.status === 'Paid' && !formData.date) {
            alert("Please select the payment date.");
            return;
        }

        setTempPaymentData(formData);
        setShowModal(false);
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError('');
    };

    const verifyPasswordAndSave = () => {
        if (passwordInput === 'admin123') {
            if (modalMode === 'add') {
                const newRecord = {
                    id: `INV-${Math.floor(Math.random() * 100000)}`,
                    month: tempPaymentData.month,
                    year: tempPaymentData.year,
                    amount: tempPaymentData.amount,
                    status: tempPaymentData.status,
                    date: tempPaymentData.status === 'Paid' ? tempPaymentData.date : '',
                    receiptUrl: tempPaymentData.receipt ? URL.createObjectURL(tempPaymentData.receipt) : null
                };
                setFees(prev => ({ ...prev, history: [newRecord, ...prev.history] }));
            } else {
                setFees(prev => ({
                    ...prev,
                    history: prev.history.map(item => item.id === tempPaymentData.id ? {
                        ...tempPaymentData,
                        date: tempPaymentData.status === 'Paid' ? tempPaymentData.date : '',
                        receiptUrl: tempPaymentData.receipt ? URL.createObjectURL(tempPaymentData.receipt) : tempPaymentData.receiptUrl
                    } : item)
                }));
            }
            setShowPasswordModal(false);
            setTempPaymentData(null);
        } else {
            setPasswordError("Incorrect Password! Access Denied.");
        }
    };

    // --- Helpers ---

    const filteredHistory = fees.history.filter(record => {
        if (filterStatus === 'All') return true;
        return record.status === filterStatus;
    });

    return (
        <div className="space-y-6">

            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="bg-red-50 px-6 py-4 rounded-xl border border-red-100">
                        <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Pending Dues</p>
                        <h3 className="text-xl font-bold text-red-700 mt-1">{fees.pending}</h3>
                    </div>
                    <div className="bg-green-50 px-6 py-4 rounded-xl border border-green-100">
                        <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Total Paid</p>
                        <h3 className="text-xl font-bold text-green-700 mt-1">{fees.paid}</h3>
                    </div>
                </div>

                <button
                    onClick={openAddModal}
                    className="bg-[#EB8A33] hover:bg-[#d97d2a] text-white px-5 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                >
                    <Plus size={20} /> Add Payment
                </button>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-800">Payment History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#EB8A33]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Transactions</option>
                            <option value="Paid">Paid Only</option>
                            <option value="Pending">Pending Only</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-4">Month & Year</th>
                                <th className="px-6 py-4">Paid Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((record, i) => {
                                    const isPaid = record.status === 'Paid';
                                    return (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            {/* MONTH & YEAR SECTION */}
                                            <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                                                {record.month} <span className="text-gray-500 font-normal">{record.year}</span>
                                            </td>

                                            {/* DATE SECTION: Only Show Date if Paid */}
                                            <td className="px-6 py-4 text-gray-500 font-mono">
                                                {isPaid ? record.date : <span className="text-gray-300">-</span>}
                                            </td>

                                            <td className="px-6 py-4 font-bold text-gray-800">{record.amount}</td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center min-h-[40px]">
                                                    {isPaid ? (
                                                        <div className="flex items-center gap-2">
                                                            {/* View */}
                                                            {record.receiptUrl ? (
                                                                <a
                                                                    href={record.receiptUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                                >
                                                                    <Eye size={18} />
                                                                </a>
                                                            ) : (
                                                                <span className="p-2 text-gray-300"><Eye size={18} /></span>
                                                            )}

                                                            {/* Download */}
                                                            <button
                                                                onClick={() => handleDownloadReceipt(record)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                            >
                                                                <Download size={18} />
                                                            </button>

                                                            {/* Edit */}
                                                            <button
                                                                onClick={() => openEditModal(record)}
                                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => handleDelete(record.id)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => openEditModal(record)}
                                                            className="flex items-center gap-1 bg-[#EB8A33] hover:bg-[#d97d2a] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                        >
                                                            add payment
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">
                                        No payment records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL (Add/Edit) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">
                                {modalMode === 'add' ? 'Add Monthly Payment' : 'Edit Payment Details'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Month Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                                    <select
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#EB8A33] text-sm bg-white"
                                        value={formData.month}
                                        onChange={e => setFormData({ ...formData, month: e.target.value })}
                                    >
                                        <option value="">-- Month --</option>
                                        {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>

                                {/* Year Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
                                    <select
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#EB8A33] text-sm bg-white"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    >
                                        {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="5000"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#EB8A33] text-sm"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>

                                {/* Status Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#EB8A33] text-sm bg-white"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date Field - Only show if Paid */}
                            {formData.status === 'Paid' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#EB8A33] text-sm text-gray-600"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt (Photo)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={e => setFormData({ ...formData, receipt: e.target.files[0] })}
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Upload size={24} />
                                        <span className="text-xs text-center px-2">
                                            {formData.receipt ? formData.receipt.name : (formData.receiptUrl ? "Update Receipt (File Selected)" : "Click to upload receipt photo")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-[#EB8A33] hover:bg-[#d97d2a] text-white py-3 rounded-lg font-bold transition-colors shadow-sm"
                                >
                                    {modalMode === 'add' ? 'Proceed to Save' : 'Update Payment'}
                                </button>
                            </div>
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
                        <p className="text-sm text-gray-500 mb-6">Enter password to confirm.</p>

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

export default ViewStudentFees;