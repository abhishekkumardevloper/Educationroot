import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const addToCart = (book) => {
        const existingItem = cart.find(item => item.id === book.id);
        let newCart;
        
        if (existingItem) {
            newCart = cart.map(item =>
                item.id === book.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cart, { ...book, quantity: 1 }];
        }
        
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (bookId) => {
        const newCart = cart.filter(item => item.id !== bookId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQuantity = (bookId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(bookId);
            return;
        }
        
        const newCart = cart.map(item =>
            item.id === bookId ? { ...item, quantity } : item
        );
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};