import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, ShoppingCart, User, LogOut, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, language, toggleLanguage } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const classes = [
        { id: 6, name: 'Class 6' },
        { id: 7, name: 'Class 7' },
        { id: 8, name: 'Class 8' },
        { id: 9, name: 'Class 9' },
        { id: 10, name: 'Class 10' },
        { id: 11, name: 'Class 11' },
        { id: 12, name: 'Class 12' },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
                        <BookOpen className="h-8 w-8 text-[#0B6FFF]" />
                        <span className="text-xl font-bold text-slate-900">EducationRoot</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-slate-600 hover:text-[#0B6FFF]" data-testid="classes-dropdown">
                                    Classes <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white">
                                {classes.map(cls => (
                                    <DropdownMenuItem key={cls.id} asChild>
                                        <Link to="/classes" className="cursor-pointer" data-testid={`class-${cls.id}-link`}>
                                            {cls.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link to="/bookstore" className="text-slate-600 hover:text-[#0B6FFF] font-medium transition-colors" data-testid="bookstore-link">
                            {language === 'en' ? 'Bookstore' : 'पुस्तक भंडार'}
                        </Link>
                        <Link to="/mock-tests" className="text-slate-600 hover:text-[#0B6FFF] font-medium transition-colors" data-testid="mock-tests-link">
                            {language === 'en' ? 'Mock Tests' : 'मॉक टेस्ट'}
                        </Link>
                        <Link to="/pricing" className="text-slate-600 hover:text-[#0B6FFF] font-medium transition-colors" data-testid="pricing-link">
                            {language === 'en' ? 'Pricing' : 'मूल्य निर्धारण'}
                        </Link>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={toggleLanguage}
                            className="text-slate-600"
                            data-testid="language-toggle"
                        >
                            <Globe className="h-4 w-4 mr-1" />
                            {language === 'en' ? 'हिं' : 'EN'}
                        </Button>

                        <Link to="/cart" className="relative" data-testid="cart-link">
                            <ShoppingCart className="h-5 w-5 text-slate-600 hover:text-[#0B6FFF]" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#0B6FFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" data-testid="user-menu">
                                        <User className="h-4 w-4 mr-1" />
                                        {user.name}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard" data-testid="dashboard-link">Dashboard</Link>
                                    </DropdownMenuItem>
                                    {user.role === 'admin' && (
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin" data-testid="admin-link">Admin Panel</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleLogout} data-testid="logout-btn">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/auth" data-testid="login-link">
                                <Button className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-6">
                                    {language === 'en' ? 'Login' : 'लॉगिन'}
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-slate-600"
                        data-testid="mobile-menu-btn"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link to="/classes" className="block py-2 text-slate-600 hover:text-[#0B6FFF]" data-testid="mobile-classes-link">
                            Classes
                        </Link>
                        <Link to="/bookstore" className="block py-2 text-slate-600 hover:text-[#0B6FFF]">
                            {language === 'en' ? 'Bookstore' : 'पुस्तक भंडार'}
                        </Link>
                        <Link to="/mock-tests" className="block py-2 text-slate-600 hover:text-[#0B6FFF]">
                            {language === 'en' ? 'Mock Tests' : 'मॉक टेस्ट'}
                        </Link>
                        <Link to="/pricing" className="block py-2 text-slate-600 hover:text-[#0B6FFF]">
                            {language === 'en' ? 'Pricing' : 'मूल्य'}
                        </Link>
                        {user && (
                            <Link to="/dashboard" className="block py-2 text-slate-600 hover:text-[#0B6FFF]">
                                Dashboard
                            </Link>
                        )}
                        {!user && (
                            <Link to="/auth" className="block py-2 text-[#0B6FFF] font-medium">
                                {language === 'en' ? 'Login' : 'लॉगिन'}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};