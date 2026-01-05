import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
    const { language } = useAuth();

    const plans = [
        {
            name: language === 'en' ? 'Basic' : 'बेसिक',
            price: 0,
            period: language === 'en' ? 'Free Forever' : 'हमेशा मुफ्त',
            features: [
                language === 'en' ? 'Access to all topics' : 'सभी विषयों तक पहुंच',
                language === 'en' ? 'Basic quizzes' : 'बेसिक क्विज़',
                language === 'en' ? 'Progress tracking' : 'प्रगति ट्रैकिंग',
                language === 'en' ? 'Community support' : 'कम्युनिटी सपोर्ट'
            ]
        },
        {
            name: language === 'en' ? 'Pro' : 'प्रो',
            price: 499,
            period: language === 'en' ? 'per month' : 'प्रति माह',
            features: [
                language === 'en' ? 'Everything in Basic' : 'बेसिक में सब कुछ',
                language === 'en' ? 'Advanced quizzes' : 'उन्नत क्विज़',
                language === 'en' ? 'PDF downloads' : 'PDF डाउनलोड',
                language === 'en' ? 'Priority support' : 'प्राथमिकता सपोर्ट',
                language === 'en' ? '20% off on books' : 'पुस्तकों पर 20% छूट'
            ],
            popular: true
        },
        {
            name: language === 'en' ? 'Premium' : 'प्रीमियम',
            price: 999,
            period: language === 'en' ? 'per month' : 'प्रति माह',
            features: [
                language === 'en' ? 'Everything in Pro' : 'प्रो में सब कुछ',
                language === 'en' ? 'Unlimited mock tests' : 'असीमित मॉक टेस्ट',
                language === 'en' ? '1-on-1 doubt sessions' : '1-ऑन-1 शंका सत्र',
                language === 'en' ? 'Live classes' : 'लाइव क्लास',
                language === 'en' ? '50% off on books' : 'पुस्तकों पर 50% छूट'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" data-testid="pricing-title">
                        {language === 'en' ? 'Choose Your Plan' : 'अपनी योजना चुनें'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {language === 'en' 
                            ? 'Start free, upgrade when you need more'
                            : 'मुफ्त में शुरू करें, जरूरत पड़ने पर अपग्रेड करें'}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-sm border-2 p-8 relative ${
                                plan.popular ? 'border-[#0B6FFF]' : 'border-slate-100'
                            }`}
                            data-testid={`pricing-plan-${index}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0B6FFF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    {language === 'en' ? 'Most Popular' : 'सबसे लोकप्रिय'}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-[#0B6FFF]">₹{plan.price}</span>
                                <span className="text-slate-600 ml-2">{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start" data-testid={`feature-${index}-${fIndex}`}>
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/auth">
                                <Button
                                    className={`w-full rounded-full py-6 ${
                                        plan.popular
                                            ? 'bg-[#0B6FFF] hover:bg-[#0055CC] text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}
                                    data-testid={`select-plan-${index}`}
                                >
                                    {language === 'en' ? 'Get Started' : 'शुरू करें'}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}