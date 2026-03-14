import React, { useState, useEffect } from 'react';
import {
    X, Zap, ChevronRight, ChevronLeft, Check, AlertCircle,
    Clock, BookOpen, User, Calendar, Trash2, Loader2, CheckCircle2
} from 'lucide-react';
import { API_URL } from '../config';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const addMinutes = (timeStr, mins) => {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
};

const FastScheduleModal = ({
    isOpen,
    onClose,
    programs = [],
    subjects = [],
    teachers = [],
    onDone,
}) => {
    const [step, setStep] = useState(1);

    // Step 1
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

    // Step 2
    const [startTime, setStartTime] = useState('08:00');
    const [classDuration, setClassDuration] = useState(60);
    const [breakDuration, setBreakDuration] = useState(15);

    // Step 3 - Preview
    const [previewSlots, setPreviewSlots] = useState([]);

    // Save state
    const [saving, setSaving] = useState(false);
    const [saveProgress, setSaveProgress] = useState({ done: 0, total: 0, errors: [] });
    const [saved, setSaved] = useState(false);

    const [error, setError] = useState('');

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedProgram('');
            setSelectedGrade('');
            setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
            setStartTime('08:00');
            setClassDuration(60);
            setBreakDuration(15);
            setPreviewSlots([]);
            setSaving(false);
            setSaveProgress({ done: 0, total: 0, errors: [] });
            setSaved(false);
            setError('');
        }
    }, [isOpen]);

    // Derived: grades from selected program
    const programObj = programs.find(p => p.name === selectedProgram);
    const duration = programObj ? parseInt(programObj.duration) || 0 : 0;
    const grades = duration > 0
        ? Array.from({ length: duration }, (_, i) => `Grade ${i + 1}`)
        : ['General'];

    // Filtered subjects for selected program + grade
    const filteredSubjects = subjects.filter(s => {
        const progMatch = s.program === selectedProgram;
        const gradeMatch = !selectedGrade || s.year === selectedGrade || s.year === 'General';
        return progMatch && gradeMatch;
    });

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const validateStep1 = () => {
        if (!selectedProgram) return 'Please select a program.';
        if (!selectedGrade) return 'Please select a grade.';
        if (selectedDays.length === 0) return 'Please select at least one day.';
        if (filteredSubjects.length === 0) return 'No subjects found for this program/grade combination.';
        return null;
    };

    const validateStep2 = () => {
        if (!startTime) return 'Please set a start time.';
        if (!classDuration || classDuration < 10) return 'Class duration must be at least 10 minutes.';
        if (breakDuration < 0) return 'Break duration cannot be negative.';
        return null;
    };

    // Generate preview slots
    const generatePreview = () => {
        const slots = [];
        selectedDays.forEach(day => {
            let currentTime = startTime;
            filteredSubjects.forEach(subject => {
                const endTime = addMinutes(currentTime, classDuration);
                slots.push({
                    key: `${day}-${subject.id}-${currentTime}`,
                    day,
                    subjectId: subject.id,
                    subjectName: subject.name,
                    grade: subject.year || 'General',
                    teacherId: subject.teacher_id || '',
                    teacherName: teachers.find(t => t.id === subject.teacher_id)?.name || '—',
                    startTime: currentTime,
                    endTime,
                    removed: false,
                });
                currentTime = addMinutes(endTime, breakDuration);
            });
        });
        return slots;
    };

    const handleNext = () => {
        setError('');
        if (step === 1) {
            const err = validateStep1();
            if (err) { setError(err); return; }
            setStep(2);
        } else if (step === 2) {
            const err = validateStep2();
            if (err) { setError(err); return; }
            setPreviewSlots(generatePreview());
            setStep(3);
        }
    };

    const handleBack = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const removeSlot = (key) => {
        setPreviewSlots(prev => prev.filter(s => s.key !== key));
    };

    const handleSaveAll = async () => {
        const toSave = previewSlots.filter(s => !s.removed);
        if (toSave.length === 0) { setError('No slots to save.'); return; }

        setSaving(true);
        setSaveProgress({ done: 0, total: toSave.length, errors: [] });

        const errors = [];
        let done = 0;

        for (const slot of toSave) {
            try {
                const payload = {
                    programId: programObj?.id,
                    subjectId: slot.subjectId,
                    teacherId: slot.teacherId || null,
                    day: slot.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    type: 'Lecture',
                };
                const res = await fetch(`${API_URL}/api/schedules`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const data = await res.json();
                    errors.push(`${slot.day} / ${slot.subjectName}: ${data.message || 'Failed'}`);
                }
            } catch {
                errors.push(`${slot.day} / ${slot.subjectName}: Network error`);
            }
            done++;
            setSaveProgress({ done, total: toSave.length, errors: [...errors] });
        }

        setSaving(false);
        setSaved(true);
        if (errors.length === 0) {
            onDone();
        }
    };

    if (!isOpen) return null;

    const stepLabels = ['Program & Days', 'Timing', 'Preview & Save'];
    const activeSlots = previewSlots.filter(s => !s.removed);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Zap size={18} className="text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Fast Schedule</h2>
                            <p className="text-xs text-gray-400">Auto-generate class slots in one click</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="px-6 pt-4 pb-2 shrink-0">
                    <div className="flex items-center gap-0">
                        {stepLabels.map((label, i) => {
                            const stepNum = i + 1;
                            const isActive = step === stepNum;
                            const isDone = step > stepNum;
                            return (
                                <React.Fragment key={stepNum}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                            ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'bg-[#ea8933] border-[#ea8933] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                            {isDone ? <Check size={14} /> : stepNum}
                                        </div>
                                        <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${isActive ? 'text-[#ea8933]' : isDone ? 'text-emerald-500' : 'text-gray-400'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < stepLabels.length - 1 && (
                                        <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${step > stepNum ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1: Program, Grade, Days */}
                    {step === 1 && (
                        <div className="space-y-5">
                            {/* Program */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Program</label>
                                <select
                                    value={selectedProgram}
                                    onChange={e => { setSelectedProgram(e.target.value); setSelectedGrade(''); }}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                                >
                                    <option value="">Select a program</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Grade */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Grade / Batch</label>
                                <select
                                    value={selectedGrade}
                                    onChange={e => setSelectedGrade(e.target.value)}
                                    disabled={!selectedProgram}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all disabled:opacity-40"
                                >
                                    <option value="">Select a grade</option>
                                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            {/* Subject preview */}
                            {selectedGrade && filteredSubjects.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Subjects to schedule ({filteredSubjects.length})
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {filteredSubjects.map(s => (
                                            <span key={s.id} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Days */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedDays.includes(day)
                                                ? 'bg-[#ea8933] border-[#ea8933] text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-[#ea8933] hover:text-[#ea8933]'
                                                }`}
                                        >
                                            {day.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Timing */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                                <p className="font-semibold mb-1">How it works</p>
                                <p>Classes will be scheduled back-to-back starting at your chosen time, with breaks in between. All <strong>{filteredSubjects.length} subjects</strong> will be placed for each of the <strong>{selectedDays.length} selected day(s)</strong>.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <Clock size={12} className="inline mr-1" />Start Time
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class Duration (min)</label>
                                    <input
                                        type="number"
                                        min={10}
                                        max={240}
                                        value={classDuration}
                                        onChange={e => setClassDuration(Number(e.target.value))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Break Between (min)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={120}
                                        value={breakDuration}
                                        onChange={e => setBreakDuration(Number(e.target.value))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Time preview summary */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-1">
                                <p className="font-bold text-gray-700 mb-2">Estimated Timeline (per day)</p>
                                {filteredSubjects.map((s, i) => {
                                    const st = addMinutes(startTime, i * (classDuration + breakDuration));
                                    const et = addMinutes(st, classDuration);
                                    return (
                                        <div key={s.id} className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                                            <span className="font-semibold text-gray-700">{s.name}</span>
                                            <span className="ml-auto text-gray-400">{st} – {et}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Preview & Save */}
                    {step === 3 && !saved && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 font-medium">
                                    <strong className="text-gray-800">{activeSlots.length}</strong> slots will be created across <strong className="text-gray-800">{selectedDays.length}</strong> day(s)
                                </p>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Click 🗑 to remove a slot</span>
                            </div>

                            {DAYS.filter(d => selectedDays.includes(d)).map(day => {
                                const daySlots = previewSlots.filter(s => s.day === day);
                                return (
                                    <div key={day} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{day}</span>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {daySlots.map(slot => (
                                                <div
                                                    key={slot.key}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-sm text-gray-800 truncate">{slot.subjectName}</div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                                                            <span className="flex items-center gap-1"><Clock size={10} />{slot.startTime} – {slot.endTime}</span>
                                                            <span className="flex items-center gap-1"><User size={10} />{slot.teacherName}</span>
                                                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{slot.grade}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSlot(slot.key)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* SAVE PROGRESS */}
                    {saving && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3">
                                <Loader2 size={20} className="text-amber-500 animate-spin" />
                                <span className="text-sm font-semibold text-gray-700">
                                    Saving slots… {saveProgress.done}/{saveProgress.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(saveProgress.done / saveProgress.total) * 100}%` }}
                                />
                            </div>
                            {saveProgress.errors.length > 0 && (
                                <div className="space-y-1">
                                    {saveProgress.errors.map((e, i) => (
                                        <p key={i} className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {e}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SAVED */}
                    {saved && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 size={36} className="text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-800">Schedule Created!</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {saveProgress.total - saveProgress.errors.length} of {saveProgress.total} slots saved successfully.
                                </p>
                                {saveProgress.errors.length > 0 && (
                                    <div className="mt-3 text-left space-y-1">
                                        <p className="text-xs font-bold text-red-500">Skipped (conflicts):</p>
                                        {saveProgress.errors.map((e, i) => (
                                            <p key={i} className="text-xs text-red-400">• {e}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!saving && !saved && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0">
                        <button
                            onClick={step === 1 ? onClose : handleBack}
                            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            {step === 1 ? <X size={16} /> : <ChevronLeft size={16} />}
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-[#ea8933] text-white rounded-xl hover:bg-[#d97c2a] font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveAll}
                                disabled={activeSlots.length === 0}
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Zap size={16} />
                                Save {activeSlots.length} Slots
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastScheduleModal;
