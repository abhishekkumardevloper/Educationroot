import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login, register, language } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success(language === 'en' ? 'Login successful!' : 'लॉगिन सफल!');
                navigate('/dashboard');
            } else {
                await register(formData.name, formData.email, formData.password);
                toast.success(language === 'en' ? 'Account created successfully!' : 'खाता बनाया गया!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || (language === 'en' ? 'An error occurred' : 'एक त्रुटि आई'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
                        <BookOpen className="h-8 w-8 text-[#0B6FFF]" />
                        <span className="text-2xl font-bold text-slate-900">EducationRoot</span>
                    </Link>

                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-6" data-testid="auth-title">
                        {isLogin 
                            ? (language === 'en' ? 'Welcome Back' : 'वापस स्वागत है')
                            : (language === 'en' ? 'Create Account' : 'खाता बनाएं')
                        }
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <Label htmlFor="name">{language === 'en' ? 'Full Name' : 'पूरा नाम'}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={language === 'en' ? 'Enter your name' : 'अपना नाम दर्ज करें'}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                    className="mt-1"
                                    data-testid="name-input"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email">{language === 'en' ? 'Email' : 'ईमेल'}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={language === 'en' ? 'Enter your email' : 'ईमेल दर्ज करें'}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="mt-1"
                                data-testid="email-input"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">{language === 'en' ? 'Password' : 'पासवर्ड'}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={language === 'en' ? 'Enter your password' : 'पासवर्ड दर्ज करें'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="mt-1"
                                data-testid="password-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full py-6"
                            disabled={loading}
                            data-testid="submit-btn"
                        >
                            {loading 
                                ? (language === 'en' ? 'Please wait...' : 'कृपया प्रतीक्षा करें...')
                                : isLogin 
                                    ? (language === 'en' ? 'Login' : 'लॉगिन')
                                    : (language === 'en' ? 'Sign Up' : 'साइन अप')
                            }
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#0B6FFF] hover:underline"
                            data-testid="toggle-auth-btn"
                        >
                            {isLogin
                                ? (language === 'en' ? "Don't have an account? Sign up" : 'खाता नहीं है? साइन अप करें')
                                : (language === 'en' ? 'Already have an account? Login' : 'पहले से खाता है? लॉगिन करें')
                            }
                        </button>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Demo Credentials:</p>
                        <p className="text-xs text-slate-600">Student: student@test.com / student123</p>
                        <p className="text-xs text-slate-600">Admin: admin@educationroot.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}