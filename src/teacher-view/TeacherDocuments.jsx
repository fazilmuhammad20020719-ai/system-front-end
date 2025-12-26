import { useOutletContext } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';

const TeacherDocuments = () => {
    const { teacher } = useOutletContext();

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacher.docs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-50 text-[#EB8A33] p-2 rounded"><FileText size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600"><Download size={18} /></button>
                    </div>
                ))}
                <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-gray-400 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <PlusIcon size={24} className="mb-2" />
                    <span className="text-xs font-bold">Upload New Document</span>
                </div>
            </div>
        </div>
    );
};

const PlusIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default TeacherDocuments;
