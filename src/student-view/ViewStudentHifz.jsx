import React from 'react';
import { BookOpen, Check, Calendar } from 'lucide-react';
import { getCompletedJuzs, getRunningJuzs, formatJuzDate } from '../hifz/hifzHelpers';

const ViewStudentHifz = ({ hifzData }) => {
    const completedJuzs = getCompletedJuzs(hifzData?.completed_juzs || '[]');
    const runningJuzs = getRunningJuzs(hifzData?.current_juz || '[]');

    return (
        <div className="space-y-6 animate-fade-in uppercase">
            {/* Hifz Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Check size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Total Completed</p>
                        <h4 className="text-2xl font-black text-gray-800">{completedJuzs.length} / 30</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Currently Running</p>
                        <h4 className="text-2xl font-black text-gray-800">
                            {runningJuzs.length > 0 ? `JUZ ${runningJuzs.map(j => j.num).join(', ')}` : 'NONE'}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Juz Grid Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <BookOpen size={20} className="text-green-600" /> 30 JUZ PROGRESS GRID
                    </h3>
                    <div className="flex gap-4 text-[10px] font-bold">
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500"></div> DONE</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-400"></div> RUNNING</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-gray-200 bg-white"></div> PENDING</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => {
                        const finishObj = completedJuzs.find(j => j.num === num);
                        const runningObj = runningJuzs.find(j => j.num === num);
                        
                        const isFinished = !!finishObj;
                        const isRunning = !!runningObj;

                        let boxColorClass = "border-gray-100 bg-white text-gray-400";
                        if (isFinished) boxColorClass = "border-green-600 bg-green-500 text-white shadow-sm";
                        else if (isRunning) boxColorClass = "border-yellow-400 bg-yellow-400 text-yellow-900 shadow-sm ring-2 ring-yellow-100 scale-105 z-10";

                        const startDate = isFinished ? finishObj.start : (isRunning ? runningObj.start : null);
                        const finishDate = isFinished ? finishObj.finish : null;

                        return (
                            <div
                                key={num}
                                className={`relative min-h-[4rem] px-1 rounded-xl border-2 font-black text-sm flex flex-col items-center justify-center gap-0.5 transition-all ${boxColorClass}`}
                            >
                                {isFinished && <Check size={12} className="absolute top-0.5 right-0.5 text-white opacity-60" />}
                                <span className={isRunning ? 'text-lg' : ''}>{num}</span>
                                {(startDate || finishDate) && (
                                    <div className="flex flex-col text-[8px] leading-[1] opacity-90 font-medium">
                                        {startDate && <span className={isFinished ? "text-blue-100" : "text-yellow-800"}>S: {formatJuzDate(startDate)}</span>}
                                        {finishDate && <span className="text-yellow-100">F: {formatJuzDate(finishDate)}</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ViewStudentHifz;
