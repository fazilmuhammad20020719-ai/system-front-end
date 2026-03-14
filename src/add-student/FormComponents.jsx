import { UploadCloud, Image as ImageIcon, FileText } from 'lucide-react';

export const InputField = ({ label, name, placeholder, value, onChange, icon: Icon, type = "text", required = false, pattern, minLength, maxLength, title, max }) => (
    <div className="space-y-1 w-full">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                title={title}
                max={max}
                className={`w-full ${Icon ? 'pl-9' : 'px-3'} pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 shadow-sm hover:border-gray-400`}
            />
        </div>
    </div>
);

export const SelectField = ({ label, name, value, onChange, options, placeholder, disabled, required = false }) => (
    <div className="space-y-1 w-full">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 shadow-sm hover:border-gray-400 cursor-pointer"
        >
            <option value="">{placeholder || 'Select'}</option>
            {options.map((opt, index) => {
                const isObject = typeof opt === 'object' && opt !== null;
                const optionValue = isObject ? opt.value : opt;
                const optionLabel = isObject ? opt.label : opt;
                return (
                    <option key={isObject ? opt.value : opt} value={optionValue}>{optionLabel}</option>
                );
            })}
        </select>
    </div>
);

export const FileUploadField = ({ label, name, file, onChange, height = "h-32", preview, accept = "image/*,.pdf,.doc,.docx" }) => {
    const isFileDoc = file && (file.type === 'application/pdf' || file.name?.endsWith('.pdf') || file.name?.endsWith('.doc') || file.name?.endsWith('.docx'));
    const isPreviewDoc = preview && (preview.endsWith('.pdf') || preview.endsWith('.doc') || preview.endsWith('.docx'));
    const showDocPreview = isFileDoc || isPreviewDoc;

    return (
        <div className="p-3 border border-gray-200 rounded-lg hover:border-green-500 transition-colors bg-white shadow-sm">
            <p className="font-bold text-gray-700 mb-2 text-xs uppercase">{label}</p>
            <div className={`${height} bg-gray-50 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-green-50/30 transition-colors`}>
                {showDocPreview ? (
                    <div className="flex flex-col items-center justify-center p-2 text-center w-full">
                        <FileText className="text-green-500 mb-2" size={28} />
                        <span className="text-[10px] text-gray-600 font-medium truncate w-full px-2" title={file ? file.name : "Document"}>
                            {file ? file.name : "Document Uploaded"}
                        </span>
                    </div>
                ) : preview || file ? (
                    <img
                        src={preview || URL.createObjectURL(file)}
                        className="w-full h-full object-contain"
                        alt="preview"
                    />
                ) : (
                    <>
                        <ImageIcon className="text-gray-300 mb-1 group-hover:text-green-600 transition-colors" size={24} />
                        <span className="text-[10px] text-gray-400 font-medium group-hover:text-green-600">Click to upload</span>
                    </>
                )}
                <input type="file" name={name} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" accept={accept} />
            </div>
        </div>
    );
};

export const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4, required = false }) => (
    <div className="space-y-1 w-full">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-gray-400 shadow-sm hover:border-gray-400 resize-none"
        />
    </div>
);
