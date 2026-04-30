import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Eye, Plus, X, Edit2, Trash2, Lock, DollarSign, Calendar, Settings, Check, Upload } from 'lucide-react';
import { API_URL } from '../config';

const academicMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const TeacherPayroll = ({ teacher, onSalaryUpdate }) => {
    const teacherId = teacher?.id;

    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [tempData, setTempData] = useState(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [saving, setSaving] = useState(false);

    // ─── Edit Basic Salary ────────────────────────────────────────────────────
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [salaryInput, setSalaryInput] = useState('');
    const [salaryLoading, setSalaryLoading] = useState(false);

    const openSalaryEdit = () => {
        setSalaryInput(teacher?.basic_salary || '');
        setShowSalaryModal(true);
    };

    const saveSalary = async () => {
        if (!salaryInput && salaryInput !== 0) return;
        setSalaryLoading(true);
        try {
            const fd = new FormData();
            fd.append('basicSalary', String(salaryInput).replace(/,/g, ''));
            const res = await fetch(`${API_URL}/api/teachers/${teacherId}`, {
                method: 'PUT',
                body: fd
            });
            if (res.ok) {
                setShowSalaryModal(false);
                if (onSalaryUpdate) onSalaryUpdate(); // trigger parent refresh
            } else {
                alert('Failed to update salary.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error.');
        } finally {
            setSalaryLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();

    const yearsList = useMemo(() => {
        const joinYear = teacher?.joining_date ? new Date(teacher.joining_date).getFullYear() : currentYear - 2;
        const start = Math.min(joinYear, currentYear - 2);
        const years = [];
        for (let y = start; y <= currentYear + 1; y++) years.push(y.toString());
        return years.sort((a, b) => b - a);
    }, [teacher, currentYear]);

    const [formData, setFormData] = useState({
        id: null,
        month: '',
        year: new Date().getFullYear().toString(),
        basic: '',
        bonus: '0',
        deductions: '0',
        date: new Date().toISOString().split('T')[0],
        receipt: null,
        receiptUrl: null
    });

    // ─── Fetch from backend ───────────────────────────────────────────────────
    const fetchPayroll = async () => {
        if (!teacherId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/teachers/${teacherId}/payroll`);
            if (res.ok) setPayroll(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchPayroll();
    }, [teacherId]);

    // ─── Build 12-month smart rows ────────────────────────────────────────────
    const monthRows = useMemo(() => {
        const now = new Date();
        const currentMonthIdx = now.getMonth();
        const currentYr = now.getFullYear();

        return academicMonths.map((monthName, idx) => {
            // Backend stores month & year as separate columns
            const record = payroll.find(r => r.month === monthName && String(r.year) === selectedYear);

            const isPast = parseInt(selectedYear) < currentYr ||
                (parseInt(selectedYear) === currentYr && idx <= currentMonthIdx);
            const isFuture = !isPast;

            let status = 'Pending';
            if (record) status = 'Paid';
            else if (isFuture) status = 'Coming';

            return { monthName, idx, record, isPast, isFuture, status };
        });
    }, [payroll, selectedYear]);

    // ─── Stats ────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const yearRecords = payroll.filter(r => String(r.year) === selectedYear);
        const totalPaid = yearRecords.reduce((acc, r) => {
            return acc + (Number(r.basic || 0) + Number(r.bonus || 0) - Number(r.deductions || 0));
        }, 0);
        const paidCount = yearRecords.length;
        return { totalPaid, paidCount };
    }, [payroll, selectedYear]);

    // ─── Open Modal ───────────────────────────────────────────────────────────
    const openPayModal = (monthName, existingRecord = null) => {
        if (existingRecord) {
            setModalMode('edit');
            setFormData({
                id: existingRecord.id,
                month: existingRecord.month,
                year: String(existingRecord.year),
                basic: existingRecord.basic,
                bonus: existingRecord.bonus,
                deductions: existingRecord.deductions || '0',
                date: existingRecord.paid_date
                    ? existingRecord.paid_date.split('T')[0]
                    : new Date().toISOString().split('T')[0],
                receipt: null,
                receiptUrl: existingRecord.receipt_url ? `${API_URL}${existingRecord.receipt_url}` : null
            });
        } else {
            setModalMode('add');
            setFormData({
                id: null,
                month: monthName,
                year: selectedYear,
                basic: teacher?.basic_salary || '',
                bonus: '0',
                deductions: '0',
                date: new Date().toISOString().split('T')[0],
                receipt: null,
                receiptUrl: null
            });
        }
        setShowModal(true);
    };

    // ─── Form Submit → Password Gate ──────────────────────────────────────────
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Duplicate check for new records
        if (modalMode === 'add') {
            const dup = payroll.some(r => r.month === formData.month && String(r.year) === formData.year);
            if (dup) { alert("This month's salary is already recorded."); return; }
        }
        setTempData(formData);
        setShowModal(false);
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError('');
    };

    // ─── Password Verify → Save to Backend ───────────────────────────────────
    const verifyPasswordAndSave = async () => {
        if (passwordInput !== 'admin123') {
            setPasswordError("Incorrect Password! Access Denied.");
            return;
        }

        setSaving(true);
        try {
            const data = new FormData();
            data.append('month', tempData.month);
            data.append('year', tempData.year);
            data.append('basic', String(tempData.basic).replace(/,/g, '') || '0');
            data.append('bonus', String(tempData.bonus).replace(/,/g, '') || '0');
            data.append('deductions', String(tempData.deductions).replace(/,/g, '') || '0');
            data.append('paid_date', tempData.date);
            data.append('status', 'Paid');
            if (tempData.receipt) data.append('document', tempData.receipt);

            const url = modalMode === 'edit'
                ? `${API_URL}/api/teachers/${teacherId}/payroll/${tempData.id}`
                : `${API_URL}/api/teachers/${teacherId}/payroll`;

            const res = await fetch(url, {
                method: modalMode === 'edit' ? 'PUT' : 'POST',
                body: data
            });

            if (res.ok) {
                await fetchPayroll(); // refresh from DB
                setShowPasswordModal(false);
                setTempData(null);
            } else {
                const err = await res.json().catch(() => ({}));
                alert('Failed to save record: ' + (err.message || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this payroll record?")) return;
        try {
            const res = await fetch(`${API_URL}/api/teachers/${teacherId}/payroll/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPayroll();
            else alert('Failed to delete record.');
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 px-6 py-4 rounded-xl text-white shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-300 font-bold uppercase tracking-wider opacity-80">Total Paid ({selectedYear})</p>
                        <h3 className="text-2xl font-bold mt-1">LKR {stats.totalPaid.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-full"><DollarSign size={24} className="text-white" /></div>
                </div>

                <div className="bg-green-50 border border-green-100 px-6 py-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Months Paid</p>
                        <h3 className="text-2xl font-bold mt-1 text-green-700">{stats.paidCount} / 12</h3>
                    </div>
                    <div className="bg-green-100 p-2.5 rounded-full"><Check size={24} className="text-green-600" /></div>
                </div>

                <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Salary Basic Rate/M</p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-800">
                            LKR {Number(teacher?.basic_salary || 0).toLocaleString()}
                        </h3>
                    </div>
                    <button
                        onClick={openSalaryEdit}
                        title="Edit Basic Salary"
                        className="bg-orange-50 hover:bg-orange-100 p-2.5 rounded-full transition-colors"
                    >
                        <Settings size={22} className="text-[#EB8A33]" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-800">Salary History</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Calendar size={16} className="text-gray-400" />
                            <select
                                className="bg-transparent text-sm outline-none text-gray-600 font-semibold cursor-pointer"
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                            >
                                {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={() => openPayModal('')}
                            className="bg-[#EB8A33] hover:bg-[#d97d2a] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm"
                        >
                            <Plus size={16} /> Process Payroll
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Month</th>
                                    <th className="px-6 py-4">Payment Date</th>
                                    <th className="px-6 py-4">Basic Salary</th>
                                    <th className="px-6 py-4">Bonus</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {monthRows.map(({ monthName, idx, record, isPast, isFuture, status }) => (
                                    <tr key={idx} className={`hover:bg-gray-50/50 transition-colors ${status === 'Pending' ? 'bg-red-50/20' : ''}`}>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {monthName}
                                            <span className="text-gray-400 font-normal ml-1 text-xs">{selectedYear}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {record?.paid_date
                                                ? new Date(record.paid_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {record ? `LKR ${Number(record.basic).toLocaleString()}` : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-medium">
                                            {record ? `+${Number(record.bonus).toLocaleString()}` : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                status === 'Coming' ? 'bg-gray-100 text-gray-500' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Pay Salary button for unpaid past months */}
                                                {!record && isPast && (
                                                    <button
                                                        onClick={() => openPayModal(monthName)}
                                                        className="flex items-center gap-1.5 bg-green-600/10 hover:bg-green-600 text-green-700 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                    >
                                                        <DollarSign size={13} /> Pay Salary
                                                    </button>
                                                )}

                                                {/* Actions for paid records */}
                                                {record && (
                                                    <div className="flex items-center justify-center gap-1">
                                                        {record.receipt_url ? (
                                                            <a
                                                                href={`${API_URL}${record.receipt_url}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Receipt"
                                                            >
                                                                <Eye size={16} />
                                                            </a>
                                                        ) : (
                                                            <span className="p-2 text-gray-300 cursor-not-allowed" title="No receipt uploaded">
                                                                <Eye size={16} />
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => openPayModal(monthName, record)}
                                                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Edit Record"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(record.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                                {isFuture && !record && (
                                                    <span className="text-xs text-gray-300 italic">Upcoming</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* FORM MODAL */}
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
                                    <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })}>
                                        <option value="">-- Month --</option>
                                        {academicMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                                        {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (LKR)</label>
                                <input type="text" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.basic} onChange={e => setFormData({ ...formData, basic: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.bonus} onChange={e => setFormData({ ...formData, bonus: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.deductions} onChange={e => setFormData({ ...formData, deductions: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                                <input type="date" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EB8A33]" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload the signed receipt</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50/50">
                                    <input type="file" accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFormData({ ...formData, receipt: e.target.files[0] })} />
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Upload size={22} />
                                        <span className="text-xs text-center px-2">
                                            {formData.receipt ? formData.receipt.name : (formData.receiptUrl ? "Existing receipt · click to replace" : "Click to upload receipt")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between">
                                <span className="font-bold text-gray-800">Net Salary:</span>
                                <span className="font-bold text-gray-900 text-base">
                                    LKR {(
                                        (parseInt(String(formData.basic).replace(/,/g, '') || 0) || 0) +
                                        (parseInt(String(formData.bonus).replace(/,/g, '') || 0) || 0) -
                                        (parseInt(String(formData.deductions).replace(/,/g, '') || 0) || 0)
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <button type="submit" className="w-full bg-[#EB8A33] hover:bg-[#d97d2a] text-white py-3 rounded-lg font-bold shadow-sm mt-2 transition-colors">
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
                            <Lock className="text-[#EB8A33]" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Verification</h3>
                        <p className="text-sm text-gray-500 mb-6">Enter admin password to process payroll.</p>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-bold tracking-widest outline-none focus:border-[#EB8A33] mb-2"
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && verifyPasswordAndSave()}
                            autoFocus
                        />
                        {passwordError && <p className="text-red-500 text-xs font-bold mb-3">{passwordError}</p>}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                disabled={saving}
                                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyPasswordAndSave}
                                disabled={saving}
                                className="flex-1 py-2.5 bg-[#EB8A33] text-white rounded-lg font-bold hover:bg-[#d97d2a] disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {saving ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</> : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* EDIT SALARY MODAL */}
            {showSalaryModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-100 p-1.5 rounded-lg">
                                    <Settings size={16} className="text-[#EB8A33]" />
                                </div>
                                <h3 className="font-bold text-gray-800">Edit Basic Salary</h3>
                            </div>
                            <button onClick={() => setShowSalaryModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Basic Rate / Month (LKR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">LKR</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full border border-gray-200 rounded-lg pl-12 pr-3 py-3 text-lg font-bold outline-none focus:border-[#EB8A33] focus:ring-1 focus:ring-orange-200"
                                        value={salaryInput}
                                        onChange={e => setSalaryInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && saveSalary()}
                                        autoFocus
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">This will update the teacher's basic monthly salary.</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowSalaryModal(false)}
                                    disabled={salaryLoading}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveSalary}
                                    disabled={salaryLoading}
                                    className="flex-1 py-2.5 bg-[#EB8A33] text-white rounded-lg font-bold hover:bg-[#d97d2a] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                                >
                                    {salaryLoading
                                        ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                                        : 'Update Salary'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPayroll;