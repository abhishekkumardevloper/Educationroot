import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { user, language } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async () => {
        if (!user) {
            toast.error(language === 'en' ? 'Please login to checkout' : 'चेकआउट के लिए लॉगिन करें');
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/orders/create', {
                amount: getTotal(),
                currency: 'INR',
                items: cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                }))
            });

            const { order_id, key_id } = response.data;

            const options = {
                key: key_id,
                amount: getTotal() * 100,
                currency: 'INR',
                order_id: order_id,
                name: 'EducationRoot',
                description: 'Book Purchase',
                handler: async function (response) {
                    try {
                        await api.post('/orders/verify', {
                            order_id: order_id,
                            payment_id: response.razorpay_payment_id
                        });
                        toast.success(language === 'en' ? 'Payment successful!' : 'भुगतान सफल!');
                        clearCart();
                        navigate('/dashboard');
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                theme: {
                    color: '#0B6FFF'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
                <div className="text-center">
                    <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {language === 'en' ? 'Your cart is empty' : 'आपकी कार्ट खाली है'}
                    </h2>
                    <p className="text-slate-600 mb-6">
                        {language === 'en' ? 'Add some books to get started' : 'शुरू करने के लिए पुस्तकें जोड़ें'}
                    </p>
                    <Link to="/bookstore">
                        <Button className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8">
                            {language === 'en' ? 'Browse Books' : 'पुस्तकें देखें'}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-8" data-testid="cart-title">
                    {language === 'en' ? 'Shopping Cart' : 'शॉपिंग कार्ट'}
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0"
                            data-testid={`cart-item-${item.id}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-20 h-28 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">
                                    {language === 'en' ? item.title : item.title_hi}
                                </h3>
                                <p className="text-[#0B6FFF] font-bold mt-1">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    data-testid={`decrease-${item.id}`}
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    data-testid={`increase-${item.id}`}
                                >
                                    +
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                data-testid={`remove-${item.id}`}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between text-2xl font-bold text-slate-900 mb-6">
                        <span>{language === 'en' ? 'Total' : 'कुल'}</span>
                        <span>₹{getTotal()}</span>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        className="w-full bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full py-6 text-lg"
                        disabled={loading}
                        data-testid="checkout-btn"
                    >
                        {loading
                            ? (language === 'en' ? 'Processing...' : 'प्रक्रिया हो रही है...')
                            : (language === 'en' ? 'Proceed to Checkout' : 'चेकआउट करें')
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}