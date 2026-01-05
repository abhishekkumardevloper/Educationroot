import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookmarkIcon, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
    const { user, language } = useAuth();
    const [progress, setProgress] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const [progressRes, bookmarksRes, purchasesRes] = await Promise.all([
                api.get('/student/progress'),
                api.get('/student/bookmarks'),
                api.get('/student/purchases')
            ]);
            setProgress(progressRes.data.progress);
            setBookmarks(bookmarksRes.data.bookmarks);
            setPurchases(purchasesRes.data.purchases);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login to view dashboard</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF]"></div>
            </div>
        );
    }

    const avgScore = progress.length > 0
        ? (progress.reduce((acc, p) => acc + p.score, 0) / progress.length).toFixed(1)
        : 0;

    const stats = [
        {
            label: language === 'en' ? 'Quizzes Taken' : 'क्विज़ लिए',
            value: progress.length,
            icon: Award,
            color: 'text-blue-500'
        },
        {
            label: language === 'en' ? 'Average Score' : 'औसत अंक',
            value: `${avgScore}%`,
            icon: TrendingUp,
            color: 'text-green-500'
        },
        {
            label: language === 'en' ? 'Bookmarks' : 'बुकमार्क',
            value: bookmarks.length,
            icon: BookmarkIcon,
            color: 'text-yellow-500'
        },
        {
            label: language === 'en' ? 'Books Purchased' : 'खरीदी गई पुस्तकें',
            value: purchases.length,
            icon: ShoppingBag,
            color: 'text-purple-500'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2" data-testid="dashboard-title">
                        {language === 'en' ? 'Welcome back' : 'वापस स्वागत है'}, {user.name}!
                    </h1>
                    <p className="text-lg text-slate-600">
                        {language === 'en' ? 'Track your learning progress' : 'अपनी सीखने की प्रगति देखें'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                                data-testid={`stat-${index}`}
                            >
                                <Icon className={`h-8 w-8 ${stat.color} mb-3`} />
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Progress */}
                {progress.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {language === 'en' ? 'Recent Quiz Results' : 'हाल के क्विज़ परिणाम'}
                        </h2>
                        <div className="space-y-3">
                            {progress.slice(0, 5).map((result, index) => (
                                <div
                                    key={result.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                                    data-testid={`progress-${index}`}
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {language === 'en' ? 'Quiz' : 'क्विज़'} #{result.quiz_id.slice(0, 8)}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {result.correct}/{result.total} {language === 'en' ? 'correct' : 'सही'}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold text-[#0B6FFF]">
                                        {result.score.toFixed(1)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookmarks */}
                {bookmarks.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {language === 'en' ? 'Your Bookmarks' : 'आपके बुकमार्क'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {bookmarks.slice(0, 6).map((bookmark) => (
                                <Link
                                    key={bookmark.id}
                                    to={`/topic/${bookmark.topic_id}`}
                                    className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    data-testid={`bookmark-${bookmark.id}`}
                                >
                                    <div className="flex items-center">
                                        <BookmarkIcon className="h-5 w-5 text-yellow-500 mr-3" />
                                        <span className="font-medium text-slate-900">{bookmark.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {progress.length === 0 && bookmarks.length === 0 && (
                    <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 text-center">
                        <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {language === 'en' ? 'Start Your Learning Journey' : 'अपनी सीखने की यात्रा शुरू करें'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {language === 'en' 
                                ? 'Take quizzes and bookmark topics to see your progress'
                                : 'अपनी प्रगति देखने के लिए क्विज़ लें'}
                        </p>
                        <Link to="/classes">
                            <Button className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8">
                                {language === 'en' ? 'Explore Classes' : 'कक्षाएं देखें'}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}