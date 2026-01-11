import { Activity } from 'lucide-react';

const ViewStudentTimeline = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="text-[#EB8A33]" size={20} /> Student Journey
            </h3>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">

                {/* Item 1 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></span>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Jun 2025</p>
                    <h4 className="text-sm font-bold text-gray-800">Awarded: Qiraat Winner</h4>
                    <p className="text-xs text-gray-500 mt-1">1st Place in Inter-class competition</p>
                </div>

                {/* Item 2 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 bg-[#EB8A33] rounded-full border-4 border-white shadow-sm"></span>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Mar 2025</p>
                    <h4 className="text-sm font-bold text-gray-800">Exam: 1st Term</h4>
                    <p className="text-xs text-gray-500 mt-1">Passed with Grade A (88%)</p>
                </div>

                {/* Item 3 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></span>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Jan 2025</p>
                    <h4 className="text-sm font-bold text-gray-800">Admission Joined</h4>
                    <p className="text-xs text-gray-500 mt-1">Enrolled in Hifz ul Quran (Grade 1)</p>
                </div>

            </div>
        </div>
    );
};

export default ViewStudentTimeline;