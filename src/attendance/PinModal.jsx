import { useState } from 'react';
import { Lock } from 'lucide-react';

const PinModal = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [pinError, setPinError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!isOpen) return null;

    const handlePinChange = (index, value) => {
        if (isNaN(value)) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        if (value && index < 3) document.getElementById(`pin-${index + 1}`).focus();
    };

    const verifyPin = () => {
        const enteredPin = pin.join('');
        if (enteredPin === "1234") {
            setSuccessMsg("Attendance Saved!");
            setPinError("");

            // Wait a moment to show success message before closing/action
            setTimeout(() => {
                setSuccessMsg("");
                setPin(["", "", "", ""]);
                onSuccess();
            }, 1500);
        } else {
            setPinError("Invalid PIN");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* 1. Change the wrapper div to a FORM to isolate the inputs */}
                <form
                    className="p-6 text-center"
                    autoComplete="off"
                    onSubmit={(e) => { e.preventDefault(); verifyPin(); }}
                >
                    {/* 2. Add this HIDDEN input. The browser will fill this instead of your search bar */}
                    <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} />

                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Verify Identity</h3>
                    <p className="text-xs text-gray-500 mb-6">Enter admin PIN to save changes</p>

                    <div className="flex justify-center gap-3 mb-6">
                        {pin.map((digit, i) => (
                            <input
                                key={i}
                                id={`pin-${i}`}
                                type="password"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handlePinChange(i, e.target.value)}
                                // 3. Add autoComplete="one-time-code" or "off"
                                autoComplete="one-time-code"
                                className="w-10 h-10 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 outline-none transition-all"
                            />
                        ))}
                    </div>

                    {pinError && <p className="text-red-500 text-xs font-bold mb-4">{pinError}</p>}

                    <div className="flex gap-2">
                        {/* Change type to button to prevent form submit */}
                        <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Cancel</button>
                        <button type="button" onClick={verifyPin} className="flex-1 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700">Verify</button>
                    </div>
                </form>
                {successMsg && <div className="bg-green-500 text-white text-center py-2 text-xs font-bold">{successMsg}</div>}
            </div>
        </div>
    );
};

export default PinModal;
