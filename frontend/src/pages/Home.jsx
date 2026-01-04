import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, Users, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { language } = useAuth();

    const stats = [
        { number: '10,000+', label: language === 'en' ? 'Students' : 'छात्र', icon: Users },
        { number: '500+', label: language === 'en' ? 'Topics' : 'विषय', icon: BookOpen },
        { number: '95%', label: language === 'en' ? 'Success Rate' : 'सफलता दर', icon: Award },
    ];

    const features = [
        {
            title: language === 'en' ? 'Topic-Wise Notes' : 'विषय-वार नोट्स',
            description: language === 'en' ? 'Comprehensive notes for every topic with formulas and diagrams' : 'फॉर्मूला और चित्रों के साथ सम्पूर्ण नोट्स'
        },
        {
            title: language === 'en' ? 'Practice Quizzes' : 'अभ्यास प्रश्नोत्तरी',
            description: language === 'en' ? 'Auto-graded quizzes to test your understanding' : 'आपकी समझ का परीक्षण करने के लिए क्विज़'
        },
        {
            title: language === 'en' ? 'Mock Tests' : 'मॉक टेस्ट',
            description: language === 'en' ? 'Full-length practice tests for exam preparation' : 'परीक्षा तैयारी के लिए पूर्ण अभ्यास परीक्षा'
        },
        {
            title: language === 'en' ? 'Quality Books' : 'गुणवत्ता पुस्तकें',
            description: language === 'en' ? 'In-house published books for deep learning' : 'गहन शिक्षा के लिए पुस्तकें'
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6" data-testid="hero-title">
                                {language === 'en' ? (
                                    <>
                                        Master Every <span className="text-[#0B6FFF]">Subject</span> with Confidence
                                    </>
                                ) : (
                                    <>
                                        हर <span className="text-[#0B6FFF]">विषय</span> में पारंगत बनें
                                    </>
                                )}
                            </h1>
                            <p className="text-lg leading-relaxed text-slate-600 mb-8">
                                {language === 'en' 
                                    ? 'Comprehensive learning platform for Classes 6-12. Topic-wise notes, practice quizzes, and expert guidance all in one place.'
                                    : 'कक्षा 6-12 के लिए सम्पूर्ण शिक्षा मंच। विषय-वार नोट्स, अभ्यास और विशेषज्ञ मार्गदर्शन।'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/classes" data-testid="explore-classes-btn">
                                    <Button className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                                        {language === 'en' ? 'Explore Classes' : 'कक्षाएं देखें'}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/pricing" data-testid="view-pricing-btn">
                                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-slate-50">
                                        {language === 'en' ? 'View Pricing' : 'मूल्य देखें'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative" data-testid="hero-image">
                            <img
                                src="https://images.pexels.com/photos/4308093/pexels-photo-4308093.jpeg"
                                alt="Student studying"
                                className="rounded-xl shadow-2xl w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                                    <Icon className="h-8 w-8 text-[#0B6FFF] mx-auto mb-3" />
                                    <div className="text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                                    <div className="text-slate-600">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {language === 'en' ? 'Everything You Need to Excel' : 'सफल होने के लिए सब कुछ'}
                        </h2>
                        <p className="text-lg text-slate-600">
                            {language === 'en' ? 'Comprehensive tools for complete exam preparation' : 'परीक्षा तैयारी के लिए सम्पूर्ण साधन'}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                                data-testid={`feature-${index}`}
                            >
                                <CheckCircle className="h-8 w-8 text-[#0B6FFF] mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#0B6FFF] py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {language === 'en' ? 'Ready to Start Your Learning Journey?' : 'अपनी सीखने की यात्रा शुरू करें?'}
                    </h2>
                    <p className="text-blue-100 text-lg mb-8">
                        {language === 'en' 
                            ? 'Join thousands of students already learning with EducationRoot'
                            : 'हजारों छात्रों के साथ EducationRoot पर पढ़ाई शुरू करें'}
                    </p>
                    <Link to="/auth" data-testid="cta-signup-btn">
                        <Button className="bg-white text-[#0B6FFF] hover:bg-slate-100 rounded-full px-8 py-6 text-lg font-semibold shadow-xl">
                            {language === 'en' ? 'Sign Up Free' : 'मुफ्त में साइन अप करें'}
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}