import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Bookmark, Download, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function TopicDetail() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [answers, setAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, language } = useAuth();

    useEffect(() => {
        fetchTopic();
        fetchQuiz();
    }, [topicId]);

    useEffect(() => {
        if (showQuiz && quiz && timeLeft === null) {
            setTimeLeft(quiz.duration_minutes * 60);
        }
    }, [showQuiz, quiz]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || quizResult) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quizResult]);

    const fetchTopic = async () => {
        try {
            const response = await api.get(`/topic/${topicId}`);
            setTopic(response.data.topic);
        } catch (error) {
            toast.error('Failed to load topic');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/quiz/${topicId}`);
            setQuiz(response.data.quiz);
        } catch (error) {
            console.log('No quiz available for this topic');
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            toast.error(language === 'en' ? 'Please login to bookmark' : 'बुकमार्क के लिए लॉगिन करें');
            return;
        }

        try {
            await api.post('/student/bookmarks', {
                topic_id: topicId,
                title: topic.title
            });
            toast.success(language === 'en' ? 'Bookmarked!' : 'बुकमार्क किया गया!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to bookmark');
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmitQuiz = async () => {
        if (!user) {
            toast.error(language === 'en' ? 'Please login to submit quiz' : 'क्विज़ जमा करने के लिए लॉगिन करें');
            return;
        }

        try {
            const response = await api.post('/quiz/submit', {
                quiz_id: quiz.id,
                topic_id: topicId,
                answers: answers
            });
            setQuizResult(response.data);
            toast.success(`Score: ${response.data.score.toFixed(1)}%`);
        } catch (error) {
            toast.error('Failed to submit quiz');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B6FFF]"></div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Topic not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {!showQuiz ? (
                    <>
                        {/* Topic Header */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="topic-title">
                                {language === 'en' ? topic.title : topic.title_hi}
                            </h1>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={handleBookmark}
                                    variant="outline"
                                    size="sm"
                                    data-testid="bookmark-btn"
                                >
                                    <Bookmark className="h-4 w-4 mr-2" />
                                    {language === 'en' ? 'Bookmark' : 'बुकमार्क'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    data-testid="download-btn"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    {language === 'en' ? 'Download PDF' : 'PDF डाउनलोड'}
                                </Button>
                            </div>
                        </div>

                        {/* Topic Content */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 mb-6 topic-content">
                            <ReactMarkdown>{language === 'en' ? topic.content : topic.content_hi}</ReactMarkdown>

                            {topic.formulas && topic.formulas.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                        {language === 'en' ? 'Important Formulas' : 'महत्वपूर्ण सूत्र'}
                                    </h3>
                                    {topic.formulas.map((formula, index) => (
                                        <div key={index} className="formula-box" data-testid={`formula-${index}`}>
                                            {formula}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quiz CTA */}
                        {quiz && (
                            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-8 shadow-sm border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            {language === 'en' ? 'Ready to test your knowledge?' : 'अपने ज्ञान का परीक्षण करें?'}
                                        </h3>
                                        <p className="text-slate-600">
                                            {quiz.questions.length} {language === 'en' ? 'questions' : 'प्रश्न'} • {quiz.duration_minutes} {language === 'en' ? 'minutes' : 'मिनट'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowQuiz(true)}
                                        className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8"
                                        data-testid="start-quiz-btn"
                                    >
                                        {language === 'en' ? 'Start Quiz' : 'क्विज़ शुरू करें'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Quiz Interface */}
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-100">
                            {!quizResult ? (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900" data-testid="quiz-title">
                                            {language === 'en' ? quiz.title : quiz.title_hi}
                                        </h2>
                                        {timeLeft !== null && (
                                            <div className="flex items-center text-lg font-semibold text-[#0B6FFF] quiz-timer" data-testid="quiz-timer">
                                                <Clock className="h-5 w-5 mr-2" />
                                                {formatTime(timeLeft)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        {quiz.questions.map((question, qIndex) => (
                                            <div key={question.id} className="border-b border-slate-100 pb-6 last:border-0" data-testid={`question-${qIndex}`}>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                                    {qIndex + 1}. {language === 'en' ? question.question : question.question_hi}
                                                </h3>
                                                <div className="space-y-2">
                                                    {question.options.map((option, oIndex) => (
                                                        <label
                                                            key={oIndex}
                                                            className="flex items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                                                            data-testid={`option-${qIndex}-${oIndex}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={question.id}
                                                                value={option}
                                                                checked={answers[question.id] === option}
                                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                                className="mr-3"
                                                            />
                                                            <span className="text-slate-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <Button
                                            onClick={handleSubmitQuiz}
                                            className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8"
                                            disabled={Object.keys(answers).length !== quiz.questions.length}
                                            data-testid="submit-quiz-btn"
                                        >
                                            {language === 'en' ? 'Submit Quiz' : 'क्विज़ जमा करें'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowQuiz(false);
                                                setAnswers({});
                                                setTimeLeft(null);
                                            }}
                                            variant="outline"
                                            className="rounded-full px-8"
                                        >
                                            {language === 'en' ? 'Cancel' : 'रद्द करें'}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8" data-testid="quiz-result">
                                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                                        {quizResult.score.toFixed(1)}%
                                    </h3>
                                    <p className="text-lg text-slate-600 mb-6">
                                        {language === 'en' 
                                            ? `You got ${quizResult.correct} out of ${quizResult.total} correct`
                                            : `आपने ${quizResult.total} में से ${quizResult.correct} सही किए`}
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setShowQuiz(false);
                                            setQuizResult(null);
                                            setAnswers({});
                                            setTimeLeft(null);
                                        }}
                                        className="bg-[#0B6FFF] hover:bg-[#0055CC] text-white rounded-full px-8"
                                    >
                                        {language === 'en' ? 'Back to Notes' : 'नोट्स पर वापस'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}