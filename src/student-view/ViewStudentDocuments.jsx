import { FileText, Download } from 'lucide-react';

const ViewStudentDocuments = ({ documents }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-[#EB8A33]" size={20} /> Attached Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-500">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                            </div>
                        </div>
                        <button className="text-[#EB8A33] hover:underline text-sm font-medium flex items-center gap-1">
                            <Download size={16} /> Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewStudentDocuments;