import React from 'react';
import { X, Edit2, History, BookOpen, Check, Save, Calendar } from 'lucide-react';

const UpdateModal = ({
    isOpen,
    onClose,
    editingStudent,
    activeTab,
    setActiveTab,
    handleSaveProgress,
    isEditingCompleted,
    setIsEditingCompleted,
    updateData,
    handleJuzGridSelect,
    studentLogs,
    getRunningJuzs
}) => {
    if (!isOpen || !editingStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 flex justify-between items-center shrink-0">
                    <div className="text-white">
                        <h3 className="font-bold text-lg uppercase">{editingStudent.student_name.toUpperCase()}</h3>
                        <p className="text-green-200 text-sm uppercase">ID: {String(editingStudent.student_id).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full uppercase"><X size={20} /></button>
                </div>

                <div className="flex border-b border-gray-200 shrink-0 uppercase">
                    <button onClick={() => setActiveTab('update')} className={`flex-1 py-3 font-semibold text-sm border-b-2 flex justify-center items-center gap-2 ${activeTab === 'update' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                        <Edit2 size={16} /> MANAGE JUZ PROGRESS
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 font-semibold text-sm border-b-2 flex justify-center items-center gap-2 ${activeTab === 'history' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                        <History size={16} /> HISTORY LOG
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === 'update' ? (
                        <form onSubmit={handleSaveProgress} className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 uppercase">
                                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <BookOpen size={16} className="text-blue-500" /> JUZ GRID
                                    </h4>
                                    <button type="button" onClick={() => setIsEditingCompleted(!isEditingCompleted)}
                                        className={`text-xs px-4 py-2 rounded-lg font-bold border transition-colors ${isEditingCompleted ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>
                                        {isEditingCompleted ? '✅ DONE EDITING COMPLETED JUZS' : '✏️ MARK COMPLETED JUZS'}
                                    </button>
                                </div>

                                <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-gray-600 uppercase">
                                    <div className="flex flex-wrap gap-4">
                                        <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-green-500"></div> COMPLETED</span>
                                        <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-yellow-400"></div> RUNNING</span>
                                        <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white"></div> NOT STARTED</span>
                                    </div>
                                    {isEditingCompleted && <span className="text-green-600 animate-pulse bg-green-50 px-2 py-1 rounded">SELECT COMPLETED BOXES</span>}
                                </div>

                                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-3">
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => {
                                        const isFinished = updateData.completed_juzs.includes(num);
                                        const isRunning = updateData.running_juzs.includes(num);

                                        let boxColorClass = "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50";
                                        if (isFinished) boxColorClass = "border-green-600 bg-green-500 text-white shadow-sm";
                                        else if (isRunning) boxColorClass = "border-yellow-500 bg-yellow-400 text-yellow-900 shadow-sm transform scale-105 ring-2 ring-yellow-200";

                                        if (isEditingCompleted) boxColorClass += " hover:scale-105 cursor-pointer border-dashed";

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => handleJuzGridSelect(num)}
                                                className={`relative h-12 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center ${boxColorClass}`}
                                            >
                                                {isFinished && <Check size={14} className="absolute top-1 right-1 text-white opacity-60" />}
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button type="submit" disabled={isEditingCompleted} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase">
                                <Save size={18} /> {isEditingCompleted ? 'FINISH EDITING FIRST' : 'SAVE PROGRESS'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {studentLogs.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 uppercase"><History size={40} className="mx-auto mb-3 opacity-30" /> No history recorded yet.</div>
                            ) : (
                                studentLogs.map((log, idx) => {
                                    const logDate = new Date(log.log_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                    const logRunningJuzs = getRunningJuzs(log.sabaq_juz);
                                    const displayRunning = logRunningJuzs.length > 0 ? logRunningJuzs.join(', ') : 'None';

                                    return (
                                        <div key={idx} className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm flex justify-between items-center uppercase">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-50 p-2.5 rounded-lg text-green-700">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">
                                                        RUNNING JUZS: {displayRunning}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                        <Calendar size={12} /> {logDate.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
