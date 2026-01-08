import { UploadCloud } from 'lucide-react';

export const InputField = ({ label, name, placeholder, value, onChange, icon: Icon, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all placeholder:text-gray-400`}
            />
        </div>
    </div>
);

export const UploadField = ({ label }) => (
    <div className="border border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#EB8A33]">
                    <UploadCloud size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-700">{label}</p>
                    <p className="text-[10px] text-gray-400">PDF or JPG (Max 5MB)</p>
                </div>
            </div>
            <span className="text-xs text-[#EB8A33] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
        </div>
    </div>
);
