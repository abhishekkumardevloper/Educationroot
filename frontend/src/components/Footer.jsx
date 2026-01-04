import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = () => {
    const { language } = useAuth();

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <BookOpen className="h-8 w-8 text-[#0B6FFF]" />
                            <span className="text-xl font-bold text-white">EducationRoot</span>
                        </div>
                        <p className="text-sm">
                            {language === 'en' 
                                ? 'Empowering students with quality education for Classes 6-12'
                                : 'कक्षा 6-12 के लिए गुणवत्तापूर्ण शिक्षा'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            {language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/classes" className="hover:text-[#0B6FFF]">Classes</Link></li>
                            <li><Link to="/bookstore" className="hover:text-[#0B6FFF]">Bookstore</Link></li>
                            <li><Link to="/mock-tests" className="hover:text-[#0B6FFF]">Mock Tests</Link></li>
                            <li><Link to="/pricing" className="hover:text-[#0B6FFF]">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            {language === 'en' ? 'Support' : 'सहायता'}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-[#0B6FFF]">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-[#0B6FFF]">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-[#0B6FFF]">FAQ</Link></li>
                            <li><Link to="/privacy" className="hover:text-[#0B6FFF]">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            {language === 'en' ? 'Connect With Us' : 'हमसे जुड़ें'}
                        </h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="hover:text-[#0B6FFF]"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-[#0B6FFF]"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-[#0B6FFF]"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-[#0B6FFF]"><Youtube className="h-5 w-5" /></a>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4" />
                            <span>support@educationroot.com</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
                    <p>&copy; 2025 EducationRoot. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};