import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Calculator, Microscope, BookOpen, Languages, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const iconMap = {
    'Calculator': Calculator,
    'Microscope': Microscope,
    'BookOpen': BookOpen,
    'Languages': Languages
};

export default function ClassDetail() {
    const { classId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useAuth();

    useEffect(() => {
        fetchSubjects();
    }, [classId]);

    const fetchSubjects = async () => {
        try {
            const response = await api.get(`/subjects/${classId}`);
            setSubjects(response.data.subjects);
        } catch (error) {
            toast.error('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <Link to="/classes" className="text-[#0B6FFF] hover:underline mb-4 inline-block">
                        &larr; {language === 'en' ? 'Back to Classes' : 'कक्षाओं पर वापस'}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="subjects-title">
                        {language === 'en' ? 'Choose a Subject' : 'विषय चुनें'}
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => {
                        const Icon = iconMap[subject.icon] || BookOpen;
                        return (
                            <Link
                                key={subject.id}
                                to={`/subject/${subject.id}`}
                                className="group"
                                data-testid={`subject-card-${subject.id}`}
                            >
                                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Icon className="h-7 w-7 text-[#0B6FFF]" />
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#0B6FFF] group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        {language === 'en' ? subject.name : subject.name_hi}
                                    </h3>
                                    <p className="text-slate-600">
                                        {language === 'en' ? subject.description : subject.description_hi}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}