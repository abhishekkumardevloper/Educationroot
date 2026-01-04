import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookOpen, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useAuth();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data.classes.sort((a, b) => a.class_number - b.class_number));
        } catch (error) {
            toast.error(language === 'en' ? 'Failed to load classes' : 'कक्षाएं लोड नहीं हुईं');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF] mx-auto"></div>
                    <p className="mt-4 text-slate-600">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="classes-title">
                        {language === 'en' ? 'Choose Your Class' : 'अपनी कक्षा चुनें'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {language === 'en' 
                            ? 'Select your class to access comprehensive study materials'
                            : 'सम्पूर्ण अध्ययन सामग्री के लिए अपनी कक्षा चुनें'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => (
                        <Link
                            key={cls.id}
                            to={`/class/${cls.id}`}
                            className="group"
                            data-testid={`class-card-${cls.class_number}`}
                        >
                            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 border border-slate-100 h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-[#0B6FFF]" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#0B6FFF] group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    {language === 'en' ? cls.name : cls.name_hi}
                                </h3>
                                <p className="text-slate-600">
                                    {language === 'en' ? cls.description : cls.description_hi}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}