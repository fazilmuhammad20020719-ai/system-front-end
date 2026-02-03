import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Download, Plus, Upload, X, Trash2, Edit2, Lock, Check, Settings } from 'lucide-react';
import jsPDF from 'jspdf';
import { API_URL } from '../config';

const ViewStudentFees = ({ studentId, admissionDate, monthlyFee: initialMonthlyFee }) => {
    // --- State Management ---
    const [fees, setFees] = useState([]); // Real DB records
    const [monthlyFeeRate, setMonthlyFeeRate] = useState(initialMonthlyFee || 0);
    const [loading, setLoading] = useState(false);

    // Modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Form & Filters
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [modalMode, setModalMode] = useState('add'); // 'add' (pay), 'edit'

    // Temp Data
    const [tempPaymentData, setTempPaymentData] = useState(null);
    const [tempRate, setTempRate] = useState(monthlyFeeRate);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordAction, setPasswordAction] = useState(null); // 'save_payment', 'delete_payment', 'update_rate'
    const [deleteId, setDeleteId] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        id: '',
        month: '',
        year: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        receipt: null,
        receiptUrl: null,
        status: 'Paid'
    });

    const academicMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Generate Year List (Admission Year -> Current + 1)
    const yearList = useMemo(() => {
        const current = new Date().getFullYear();
        const start = admissionDate ? new Date(admissionDate).getFullYear() : current - 2;
        const years = [];
        for (let y = start; y <= current + 1; y++) {
            years.push(y.toString());
        }
        return years.sort((a, b) => b - a); // Descending
    }, [admissionDate]);

    // --- Fetch Real Fees ---
    const fetchFees = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/students/${studentId}/fees`);
            if (response.ok) {
                const data = await response.json();
                setFees(data);
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
        setMonthlyFeeRate(initialMonthlyFee);
    }, [studentId, initialMonthlyFee]);

    // --- Generate Automated Rows (Jan-Dec for Selected Year) ---
    const feeRows = useMemo(() => {
        const rows = [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonthIdx = now.getMonth(); // 0-11

        // Iterate Jan (0) to Dec (11)
        for (let i = 0; i < 12; i++) {
            const monthName = academicMonths[i];
            const yearStr = selectedYear;
            const yearInt = parseInt(yearStr);

            // Find all payment records for this month/year
            const monthTxns = fees.filter(f => f.month === monthName && f.year === yearStr);

            const totalPaidAmount = monthTxns.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
            const balance = Math.max(0, monthlyFeeRate - totalPaidAmount);

            // Latest record info (for date/receipt display)
            const latestTxn = monthTxns.length > 0 ? monthTxns[0] : null;
            // Note: DB sorts by created_at DESC, so [0] is latest

            // Determine Status
            let status = 'Pending';

            if (balance <= 0) {
                status = 'Paid';
            } else {
                // Balance > 0
                if (yearInt > currentYear) {
                    status = 'Coming';
                } else if (yearInt === currentYear) {
                    if (i > currentMonthIdx) { // Future month in current year
                        status = 'Coming';
                    }
                    // Else: Current or Past month with balance -> Pending
                }
            }

            rows.push({
                sysId: `${monthName}-${yearStr}`, // Unique Key
                month: monthName,
                year: yearStr,
                paidAmount: totalPaidAmount,
                balance: balance,
                status: status,

                // Display Info (from latest txn or empty)
                date: latestTxn ? (latestTxn.paid_date ? latestTxn.paid_date.split('T')[0] : '') : '',
                receiptUrl: latestTxn ? (latestTxn.receipt_url ? `${API_URL}${latestTxn.receipt_url}` : null) : null,

                // Data for Actions
                txns: monthTxns,
                hasTxns: monthTxns.length > 0,

                // Original needed for helpers
                amount: totalPaidAmount // for visual compatibility
            });
        }

        return rows;
    }, [fees, selectedYear, monthlyFeeRate]);

    const filteredRows = feeRows.filter(row => {
        if (filterStatus !== 'All' && row.status !== filterStatus) return false;
        if (selectedMonth !== 'All' && row.month !== selectedMonth) return false;
        return true;
    });

    // Stats (Annual)
    const totalPaid = feeRows
        .reduce((sum, row) => sum + row.paidAmount, 0);

    const totalPending = feeRows
        .filter(row => row.status === 'Pending')
        .reduce((sum, row) => sum + row.balance, 0);



    // --- Handlers ---

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            id: '',
            month: academicMonths[new Date().getMonth()],
            year: new Date().getFullYear().toString(),
            amount: monthlyFeeRate,
            date: new Date().toISOString().split('T')[0],
            receipt: null,
            receiptUrl: null,
            status: 'Paid'
        });
        setShowPaymentModal(true);
    };

    // 1. Pay / Add Handler
    const handlePayClick = (row) => {
        setModalMode('add');
        setFormData({
            id: '',
            month: row.month,
            year: row.year,
            amount: row.balance > 0 ? row.balance : monthlyFeeRate, // Default to balance
            date: new Date().toISOString().split('T')[0],
            receipt: null,
            receiptUrl: null,
            status: 'Paid'
        });
        setShowPaymentModal(true);
    };

    // 2. Edit Handler (Edits the latest transaction by default)
    const handleEditClick = (row) => {
        if (!row.hasTxns) return;
        const record = row.txns[0]; // Edit the latest one
        setModalMode('edit');
        setFormData({
            id: record.id,
            month: record.month,
            year: record.year,
            amount: record.amount,
            date: record.paid_date ? record.paid_date.split('T')[0] : '',
            receipt: null,
            receiptUrl: record.receipt_url ? `${API_URL}${record.receipt_url}` : null,
            status: record.status
        });
        setShowPaymentModal(true);
    };

    // 3. Delete Handler (Initiate)
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setPasswordAction('delete_payment');
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError('');
    };

    // 4. Rate Update Handler (Initiate)
    const handleUpdateRateClick = () => {
        setTempRate(monthlyFeeRate);
        setShowRateModal(true);
    };

    const confirmUpdateRate = () => {
        setPasswordAction('update_rate');
        setShowRateModal(false);
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError('');
    };

    // 5. Form Submit (Direct Save)
    const handlePaymentFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount) {
            alert("Amount is required.");
            return;
        }
        executeSavePayment(formData);
        setShowPaymentModal(false);
    };

    // --- Execute Actions (After Password) ---

    // Execute Delete
    const executeDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/students/${studentId}/fees/${deleteId}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchFees();
            else alert("Failed to delete.");
        } catch (error) {
            console.error(error);
        }
    };

    // Execute Save Payment
    const executeSavePayment = async (dataOverride) => {
        const data = dataOverride || tempPaymentData;
        if (!data) return;

        const submitData = new FormData();
        submitData.append('month', data.month);
        submitData.append('year', data.year);
        submitData.append('amount', data.amount);
        submitData.append('status', data.status);
        if (data.date) submitData.append('date', data.date);
        if (data.receipt) submitData.append('document', data.receipt);

        try {
            let url = `${API_URL}/api/students/${studentId}/fees`;
            let method = 'POST';

            if (modalMode === 'edit') {
                url = `${API_URL}/api/students/${studentId}/fees/${data.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, { method, body: submitData });
            if (response.ok) {
                fetchFees();
            } else {
                alert("Failed to save.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Execute Update Rate
    const executeUpdateRate = async () => {
        try {
            const response = await fetch(`${API_URL}/api/students/${studentId}/monthly-fee`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthlyFee: tempRate })
            });

            if (response.ok) {
                setMonthlyFeeRate(tempRate);
            } else {
                alert("Failed to update rate.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const verifyPassword = () => {
        if (passwordInput === 'admin123') {
            setShowPasswordModal(false);
            if (passwordAction === 'delete_payment') executeDelete();
            if (passwordAction === 'save_payment') executeSavePayment();
            if (passwordAction === 'update_rate') executeUpdateRate();
        } else {
            setPasswordError("Incorrect Password!");
        }
    };

    // Receipt PDF
    const handleDownloadReceipt = (record) => {
        const doc = new jsPDF();
        doc.setFillColor(235, 138, 51);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("PAYMENT RECEIPT", 105, 25, null, null, "center");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        let y = 60;
        const line = (l, v) => { doc.setFont("helvetica", "bold"); doc.text(`${l}:`, 20, y); doc.setFont("helvetica", "normal"); doc.text(`${v}`, 80, y); y += 15; };

        // For aggregated, show summary
        const txnId = record.txns && record.txns.length > 0 ? record.txns[0].id : "N/A";

        line("Invoice ID", `INV-${txnId}`);
        line("Student ID", studentId);
        line("Month", `${record.month} ${record.year}`);
        line("Date", record.date);
        line("Total Paid", `Rs. ${record.paidAmount}`);
        line("Status", record.status.toUpperCase());

        doc.save(`Receipt_${record.month}_${record.year}.pdf`);
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full xl:w-auto">
                    <div className="bg-red-50 px-5 py-3 rounded-xl border border-red-100 min-w-[200px]">
                        <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Pending ({selectedYear})</p>
                        <h3 className="text-xl font-bold text-red-700 mt-1">Rs. {totalPending.toLocaleString()}</h3>
                    </div>
                    <div className="bg-green-50 px-5 py-3 rounded-xl border border-green-100 min-w-[200px]">
                        <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Paid ({selectedYear})</p>
                        <h3 className="text-xl font-bold text-green-700 mt-1">Rs. {totalPaid.toLocaleString()}</h3>
                    </div>
                    <div className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 min-w-[200px] flex justify-between items-center group cursor-pointer hover:bg-blue-100 transition-colors" onClick={handleUpdateRateClick}>
                        <div>
                            <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Monthly Rate</p>
                            <h3 className="text-xl font-bold text-blue-700 mt-1">Rs. {monthlyFeeRate}</h3>
                        </div>
                        <Settings size={18} className="text-blue-400 group-hover:text-blue-600 group-hover:rotate-90 transition-all" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={openAddModal} className="bg-[#EB8A33] hover:bg-[#d97d2a] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm">
                        <Plus size={18} /> Manual Payment
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-800">Fee Records</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Month Filter */}
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#EB8A33]"
                        >
                            <option value="All">All Months</option>
                            {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>

                        {/* Year Filter */}
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#EB8A33] font-semibold"
                        >
                            {yearList.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        {/* Status Filter */}
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#EB8A33]">
                            <option value="All">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Coming">Coming</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Paid Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row, i) => (
                                    <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${row.balance > 0 ? 'bg-red-50/10' : ''}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                                            {row.month} <span className="text-gray-400 font-normal ml-1">{row.year}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono">
                                            {row.date || <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            Rs. {row.paidAmount}
                                            {row.balance > 0 && <span className="text-[10px] text-red-500 block font-normal">Due: Rs. {row.balance}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                row.status === 'Coming' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit/Delete/View controls if Txns exist */}
                                                {row.hasTxns && (
                                                    <>

                                                        <button
                                                            onClick={() => handleDownloadReceipt(row)}
                                                            title="Download Receipt"
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(row)}
                                                            title="Edit Payment"
                                                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(row.txns[0].id)}
                                                            title="Cancel Payment"
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Pay Button if Balance > 0 */}
                                                {/* If Status is Pending, we allow payment */}
                                                {/* Even if partial records exist, we can Add Payment (Pay Balance) */}
                                                {row.balance > 0 && row.status !== 'Coming' && (
                                                    <button onClick={() => handlePayClick(row)} className="flex items-center gap-1 bg-green-600/10 hover:bg-green-600 text-green-700 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-2">
                                                        {row.hasTxns ? 'Pay Balance' : 'Pay Now'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">{modalMode === 'add' ? 'Record Payment' : 'Edit Payment'}</h3>
                            <button onClick={() => setShowPaymentModal(false)}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                        </div>
                        <form onSubmit={handlePaymentFormSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                                    <select required value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm">
                                        <option value="">Select</option>
                                        {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                                    <input type="number" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (Rs.)</label>
                                <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Date</label>
                                <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm" />
                            </div>



                            <button type="submit" className="w-full bg-[#EB8A33] hover:bg-[#d97d2a] text-white py-3 rounded-lg font-bold shadow-sm mt-2">Proceed</button>
                        </form>
                    </div>
                </div>
            )}

            {/* RATE MODAL */}
            {showRateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Settings size={22} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">Update Monthly Fee</h3>
                            <p className="text-sm text-gray-500">Set the default monthly fee for this student.</p>
                        </div>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl font-bold text-gray-800 outline-none focus:border-blue-500 mb-6"
                            value={tempRate}
                            onChange={(e) => setTempRate(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setShowRateModal(false)} className="flex-1 py-2 rounded-lg border border-gray-200 font-semibold text-gray-600">Cancel</button>
                            <button onClick={confirmUpdateRate} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Modal - Dynamic Title */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {passwordAction === 'delete_payment' ? 'Cancel Payment' : 'Admin Verification'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {passwordAction === 'delete_payment'
                                ? 'Are you sure you want to cancel this payment? Enter password to confirm.'
                                : 'Enter password to confirm action.'}
                        </p>

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
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50">Back</button>
                            <button onClick={verifyPassword} className={`flex-1 py-1 rounded-lg font-bold text-white ${passwordAction === 'delete_payment' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#EB8A33] hover:bg-[#d97d2a]'}`}>
                                {passwordAction === 'delete_payment' ? 'Cancel Payment' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewStudentFees;