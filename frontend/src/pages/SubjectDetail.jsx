import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectDetail() {
    const { subjectId } = useParams();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useAuth();

    useEffect(() => {
        fetchTopics();
    }, [subjectId]);

    const fetchTopics = async () => {
        try {
            const response = await api.get(`/topics/${subjectId}`);
            setTopics(response.data.topics);
        } catch (error) {
            toast.error('Failed to load topics');
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
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="topics-title">
                        {language === 'en' ? 'Topics' : 'विषय'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {language === 'en' ? 'Choose a topic to start learning' : 'सीखना शुरू करने के लिए एक विषय चुनें'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {topics.map((topic) => (
                        <Link
                            key={topic.id}
                            to={`/topic/${topic.id}`}
                            className="group"
                            data-testid={`topic-card-${topic.id}`}
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-[#0B6FFF] transition-colors">
                                            {language === 'en' ? topic.title : topic.title_hi}
                                        </h3>
                                        {topic.duration_minutes && (
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {topic.duration_minutes} {language === 'en' ? 'min read' : 'मिनट'}
                                            </div>
                                        )}
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#0B6FFF] group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {language === 'en' ? 'Notes + Quiz' : 'नोट्स + क्विज़'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {topics.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">
                            {language === 'en' ? 'No topics available yet' : 'अभी कोई विषय उपलब्ध नहीं'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}