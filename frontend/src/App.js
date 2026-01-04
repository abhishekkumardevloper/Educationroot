import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import SubjectDetail from './pages/SubjectDetail';
import TopicDetail from './pages/TopicDetail';
import Bookstore from './pages/Bookstore';
import Cart from './pages/Cart';
import MockTests from './pages/MockTests';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/class/:classId" element={<ClassDetail />} />
                <Route path="/subject/:subjectId" element={<SubjectDetail />} />
                <Route path="/topic/:topicId" element={<TopicDetail />} />
                <Route path="/bookstore" element={<Bookstore />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/mock-tests" element={<MockTests />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center" richColors />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
