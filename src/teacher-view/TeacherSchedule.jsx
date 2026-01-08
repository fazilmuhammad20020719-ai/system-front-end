const TeacherSchedule = ({ schedule }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Class/Grade</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {schedule.map((slot, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">{slot.day}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">{slot.time}</td>
                            <td className="px-6 py-4 text-sm text-blue-600 font-bold">{slot.subject}</td>
                            <td className="px-6 py-4 text-xs font-bold bg-gray-100 text-gray-600 rounded w-fit px-2">{slot.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherSchedule;