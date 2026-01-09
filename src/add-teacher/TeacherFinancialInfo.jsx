import { DollarSign, CreditCard, Building } from 'lucide-react';
import { InputField } from '../add-student/FormComponents';

const TeacherFinancialInfo = ({ formData, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <DollarSign className="text-[#EB8A33]" size={18} /> Financial & Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Basic Salary" name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} icon={DollarSign} />
                <div className="hidden md:block"></div> {/* Spacer */}

                <InputField label="Bank Name" name="bankName" placeholder="Eg: Bank of Ceylon" value={formData.bankName} onChange={handleChange} icon={Building} />
                <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} icon={CreditCard} />
            </div>
            <p className="text-xs text-gray-500 mt-4 bg-yellow-50 p-3 rounded border border-yellow-100">
                Note: Salary information is confidential and visible only to Admins.
            </p>
        </div>
    );
};

export default TeacherFinancialInfo;
