import { MapPin, BookOpen, Calendar, Phone } from 'lucide-react';
import { API_URL } from '../config';

const StudentProfileHeader = ({ student }) => {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white pt-8 pb-16 px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Profile Photo */}
                <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                    {student.photo_url ? (
                        <img src={`${API_URL}${student.photo_url}`} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/50">
                            {student.name?.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{student.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${student.status === 'Active' ? 'bg-green-500/20 border-green-400 text-green-100' : 'bg-red-500/20 border-red-400 text-red-100'}`}>
                            {student.status}
                        </span>
                    </div>

                    <p className="text-blue-100 font-mono text-lg mb-4">{student.indexNumber || student.id}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-blue-100/90">
                        {/* FIX: student.program -> student.program_name */}
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span>{student.program_name || student.program || 'No Program'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Batch: {student.session_year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{student.city || 'Unknown City'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{student.contact_number}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <BookOpen size={300} />
            </div>
        </div>
    );
};

export default StudentProfileHeader;