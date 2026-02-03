import { useState } from 'react';
import Sidebar from './Sidebar';
import { Check, Crown, Server, Globe, HardDrive, Settings, ShieldCheck, Mail } from 'lucide-react';

const Subscription = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const features = [
        { icon: Server, text: "High-Performance Server" },
        { icon: Globe, text: "Domain Name Management" },
        { icon: HardDrive, text: "Secure Cloud Storage" },
        { icon: Settings, text: "System Fees & Maintenance" },
        { icon: ShieldCheck, text: "Premium Service & Support" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
                <main className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">

                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

                        {/* LEFT COLUMN: Text Content */}
                        <div className="text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
                                <Crown size={14} className="fill-yellow-500 text-yellow-600" />
                                Premium Plan
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                Unlock the Full Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">FMAC System</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Ensure smooth operations with our all-inclusive comprehensive subscription. We handle the technical heavy lifting so you can focus on education.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600">
                                            <feature.icon size={18} />
                                        </div>
                                        {feature.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Pricing Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center text-center">

                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 transform rotate-3 group-hover:rotate-6 transition-transform">
                                    <Crown size={32} />
                                </div>

                                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Subscription</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-bold text-gray-500">LKR</span>
                                    <span className="text-5xl font-black text-gray-900 tracking-tighter">9,000</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-8">Billed monthly • Cancel anytime</p>

                                <ul className="space-y-4 w-full text-left mb-8 border-t border-b border-gray-100 py-6">
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">Dedicated <b>Server Hosting</b></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">Premium <b>Domain Name</b></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">Daily <b>Cloud Backups</b></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">24/7 <b>Priority Support</b></span>
                                    </li>
                                </ul>

                                <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-2">
                                    Subscribe Now
                                </button>

                                <p className="mt-4 text-xs text-center text-gray-400">
                                    By subscribing, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Subscription;
