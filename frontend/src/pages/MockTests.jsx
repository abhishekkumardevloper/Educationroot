import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Clock, FileText, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function MockTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useAuth();

    useEffect(() => {
        fetchMockTests();
    }, []);

    const fetchMockTests = async () => {
        try {
            const response = await api.get('/mock-tests');
            setTests(response.data.tests);
        } catch (error) {
            toast.error('Failed to load mock tests');
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="mock-tests-title">
                        {language === 'en' ? 'Mock Tests' : 'मॉक टेस्ट'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {language === 'en' 
                            ? 'Practice with full-length mock tests'
                            : 'पूर्ण लंबाई के मॉक टेस्ट के साथ अभ्यास करें'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {tests.map((test) => (
                        <div
                            key={test.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 p-8"
                            data-testid={`mock-test-${test.id}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Award className="h-6 w-6 text-[#0B6FFF]" />
                                </div>
                                <div className="text-sm font-semibold text-[#0B6FFF] bg-blue-50 px-3 py-1 rounded-full">
                                    {test.subject}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                {language === 'en' ? test.title : test.title_hi}
                            </h3>

                            <div className="flex items-center gap-6 text-slate-600 mb-6">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2" />
                                    {test.duration_minutes} {language === 'en' ? 'min' : 'मिनट'}
                                </div>
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2" />
                                    {test.questions_count} {language === 'en' ? 'questions' : 'प्रश्न'}
                                </div>
                                <div className="flex items-center">
                                    <Award className="h-5 w-5 mr-2" />
                                    {test.total_marks} {language === 'en' ? 'marks' : 'अंक'}
                                </div>
                            </div>

                            <Button
                                className="w-full bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full"
                                data-testid={`start-test-${test.id}`}
                            >
                                {language === 'en' ? 'Start Test' : 'टेस्ट शुरू करें'}
                            </Button>
                        </div>
                    ))}
                </div>

                {tests.length === 0 && (
                    <div className="text-center py-12">
                        <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">
                            {language === 'en' ? 'No mock tests available yet' : 'अभी कोई मॉक टेस्ट उपलब्ध नहीं'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}