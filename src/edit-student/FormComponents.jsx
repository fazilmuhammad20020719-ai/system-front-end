import { UploadCloud } from 'lucide-react';

export const InputField = ({ label, name, placeholder, value, onChange, icon: Icon, type = "text" }) => (
    <div className="space-y-1.5 w-full">
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

export const SelectField = ({ label, name, value, onChange, options, placeholder, disabled }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#EB8A33] focus:ring-1 focus:ring-[#EB8A33] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="">{placeholder || 'Select'}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
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
                    <p className="text-[10px] text-gray-400">PDF or JPG (Max 2MB)</p>
                </div>
            </div>
            <span className="text-xs text-[#EB8A33] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
        </div>
    </div>
);

export const UsersIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
