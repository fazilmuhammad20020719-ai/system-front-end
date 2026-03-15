import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Book,
    Award,
    ArrowRight,
    Shield,
    BookOpen,
    Calendar,
    CheckCircle2
} from 'lucide-react';

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 p-2 rounded-xl shadow-sm">
                                <Book className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-600">
                                Faizanul Madeena
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
                            <a href="#about" className="hover:text-green-600 transition-colors">About</a>
                            <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <button className="hidden md:flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors px-4 py-2 rounded-lg hover:bg-green-50">
                                    Staff Portal
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5">
                                    Admin Login
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 blur-[100px] rounded-full mix-blend-multiply"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-green-400 blur-[100px] rounded-full mix-blend-multiply"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-400 blur-[100px] rounded-full mix-blend-multiply"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-600 mb-8 max-w-fit mx-auto text-sm font-medium">
                        <span className="flex h-2 w-2 rounded-full bg-green-600"></span>
                        Management Intelligence System
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                        Nurturing <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-600 to-green-600">
                            Knowledge & Wisdom
                        </span>
                    </h1>

                    <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        The official central management portal for Faizanul Madeena Arabic College. Empowering our administrators and staff to manage student progress, admissions, and institutional operations with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                Access Dashboard
                            </button>
                        </Link>
                    </div>

                    {/* Stats / Trust indicators */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">Est.</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Foundation</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">500+</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Active Scholars</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">100%</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Dedicated Faculty</p>
                        </div>
                        <div className="text-center hidden sm:block">
                            <p className="text-4xl font-bold text-slate-900">Secure</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Digital Records</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-green-600 font-semibold tracking-wide uppercase text-sm mb-3">System Capabilities</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive College Administration</h3>
                        <p className="text-lg text-slate-600">
                            Purpose-built tools designed specifically for the unique administrative needs of our Arabic College.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-100 transition-all group">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                                <Users className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Scholar Management</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Complete student profiles covering admissions, personal details, guardian information, and ongoing progress.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-100 transition-all group">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                                <Book className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Academic & Hifz Tracking</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Detailed tracking of Alim course progression, Hifz performance, and term-wise academic evaluations.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-100 transition-all group">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-300">
                                <Calendar className="h-7 w-7 text-amber-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Daily Attendance</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Seamless daily attendance monitoring for regular classes and special programs, with automated reporting.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-100 transition-all group">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                                <BookOpen className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Fee & Dues Management</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Organized tracking of tuition fees, boarding charges, and other collections with clear receipt histories.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-rose-100 transition-all group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-300">
                                <Shield className="h-7 w-7 text-rose-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Document Vault</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Secure digital storage for previous academic certificates, identity proofs, and college credentials.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                                <Award className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Certifications</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Centralized system for generating, verifying, and distributing course completion certificates and awards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-green-500/20 to-green-600/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/20 to-green-500/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Staff & Administrative Portal</h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Authorized personnel can log in to manage student records, update daily attendance, and process administrative tasks.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-green-900/50 hover:-translate-y-1">
                                Secure Login
                            </button>
                        </Link>
                    </div>
                    <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Authorized Access Only</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Encrypted Data</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> Monitored Activity</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-green-600 p-1.5 rounded-lg">
                                    <Book className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">Faizanul Madeena</span>
                            </div>
                            <p className="text-slate-500 max-w-md">
                                Dedicated to providing excellent Islamic and contemporary education. Developing scholars of the future with profound knowledge and wisdom.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
                            <ul className="space-y-3 text-slate-500 text-sm">
                                <li><a href="#features" className="hover:text-green-600 transition-colors">Portal Features</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Admissions</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Academic Calendar</a></li>
                                <li><Link to="/login" className="hover:text-green-600 transition-colors">Staff Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
                            <ul className="space-y-3 text-slate-500 text-sm">
                                <li><a href="#" className="hover:text-green-600 transition-colors">Support Center</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Contact Administration</a></li>
                                <li><a href="#" className="hover:text-green-600 transition-colors">Campus Location</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} Faizanul Madeena Arabic College. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-green-600 transition-colors">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
