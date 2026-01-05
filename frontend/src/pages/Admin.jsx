import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Admin() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAnalytics();
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF]"></div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Users',
            value: analytics?.total_users || 0,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            label: 'Total Topics',
            value: analytics?.total_topics || 0,
            icon: BookOpen,
            color: 'text-green-500',
            bg: 'bg-green-50'
        },
        {
            label: 'Total Orders',
            value: analytics?.total_orders || 0,
            icon: ShoppingBag,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            label: 'Total Revenue',
            value: `₹${analytics?.total_revenue || 0}`,
            icon: DollarSign,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-8" data-testid="admin-title">
                    Admin Dashboard
                </h1>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                                data-testid={`admin-stat-${index}`}
                            >
                                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Content Management</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold text-slate-900 mb-2">Add New Topic</h3>
                            <p className="text-sm text-slate-600 mb-3">Create new learning topics for students</p>
                            <button className="text-[#0B6FFF] hover:underline text-sm font-medium">
                                Coming Soon
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold text-slate-900 mb-2">Manage Books</h3>
                            <p className="text-sm text-slate-600 mb-3">Add or edit books in the store</p>
                            <button className="text-[#0B6FFF] hover:underline text-sm font-medium">
                                Coming Soon
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold text-slate-900 mb-2">Quiz Builder</h3>
                            <p className="text-sm text-slate-600 mb-3">Create and manage quizzes</p>
                            <button className="text-[#0B6FFF] hover:underline text-sm font-medium">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}