'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
    options?: string[];
}

interface ChatBotProps {
    onNavigateToLogin?: () => void;
    onShowTrackDialog?: (trackingId?: string) => void;
}

/**
 * ChatBot - Client Component
 * 
 * Interactive chatbot assistant for the water-tax portal.
 * Handles user queries and provides quick actions.
 */
export function ChatBot({ onNavigateToLogin, onShowTrackDialog }: ChatBotProps = {}) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'bot',
            content:
                '👋 Hello! I\'m your Water Services Assistant. I can help you with:\n\n• Apply for new water connection\n• Pay your water bills\n• Track application status\n• Submit meter readings\n• Raise grievances\n• General queries\n\nHow can I assist you today?',
            timestamp: new Date(),
            options: [
                'Apply for New Connection',
                'Pay Bills',
                'Track Application',
                'Submit Meter Reading',
                'Raise Grievance',
                'General Query',
            ],
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatMessagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [chatMessages]);

    // Auto-scroll when chat opens
    useEffect(() => {
        if (isChatOpen && !isChatMinimized && chatMessagesEndRef.current) {
            setTimeout(() => {
                chatMessagesEndRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }, 100);
        }
    }, [isChatOpen, isChatMinimized]);

    const handleChatSubmit = (message: string) => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput('');

        // Bot response logic
        setTimeout(() => {
            let botResponse: ChatMessage;
            const lowerMessage = message.toLowerCase();

            if (lowerMessage.includes('new connection') || lowerMessage.includes('apply')) {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content:
                        'Great! To apply for a new water connection, I\'ll need some information:\n\n1. Property details (address, property ID)\n2. Owner information\n3. Connection type (Residential/Commercial)\n4. Required documents\n\nWould you like to:\n• Start the application process (requires login)\n• Know about required documents\n• Check eligibility criteria',
                    timestamp: new Date(),
                    options: [
                        'Start Application (Login Required)',
                        'Required Documents',
                        'Eligibility Criteria',
                    ],
                };
            } else if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content:
                        'You can track your application or grievance status by entering your Tracking ID.\n\nTracking ID formats:\n• APP-YYYY-XXX (Logged-in user applications)\n• WNC-YYYY-XXXXXX (First water connection)\n• GRV-YYYY-XXX (Grievances)\n\nWould you like to track now?',
                    timestamp: new Date(),
                    options: ['Track Application', 'Sample Tracking IDs'],
                };
            } else if (lowerMessage.includes('sample')) {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content:
                        'Sample Tracking IDs for testing:\n\n• APP-2025-001 (Under Review)\n• APP-2025-002 (Approved)\n• WNC-2025-180652 (First Connection - Under Review)\n• GRV-2025-023 (Grievance - In Progress)\n\nTry tracking any of these!',
                    timestamp: new Date(),
                    options: [
                        'Track APP-2025-001',
                        'Track WNC-2025-180652',
                        'Track GRV-2025-023',
                    ],
                };
            } else if (lowerMessage.includes('login')) {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content:
                        '🔐 To proceed, please login using:\n\n• Mobile Number + OTP\n• Consumer ID + OTP\n\nNo password required!',
                    timestamp: new Date(),
                    options: ['Go to Login Page'],
                };
            } else {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content:
                        'I can help you with:\n\n• New water connections\n• Bill payments\n• Application tracking\n• Meter readings\n• Grievances\n\nWhat would you like to know more about?',
                    timestamp: new Date(),
                    options: ['New Connection', 'Pay Bills', 'Track Application'],
                };
            }

            setChatMessages((prev) => [...prev, botResponse]);
        }, 500);
    };

    const handleOptionClick = (option: string) => {
        handleChatSubmit(option);

        if (option === 'Go to Login Page' || option.includes('Login Required')) {
            setTimeout(() => {
                if (onNavigateToLogin) {
                    onNavigateToLogin();
                } else if (typeof window !== 'undefined') {
                    window.location.href = '/water-tax/citizen?view=login';
                }
            }, 1000);
        } else if (
            option === 'Track Application' ||
            option.startsWith('Track APP-') ||
            option.startsWith('Track WNC-') ||
            option.startsWith('Track GRV-')
        ) {
            setTimeout(() => {
                setIsChatOpen(false);
                if (option.startsWith('Track ')) {
                    const appId = option.replace('Track ', '');
                    onShowTrackDialog?.(appId);
                } else {
                    onShowTrackDialog?.();
                }
            }, 500);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isChatOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                    }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center z-50 transition-transform hover:scale-110"
                >
                    <Bot className="h-7 w-7" />
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.button>
            )}

            {/* Chat Window */}
            {isChatOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
                >
                    <Card className="shadow-2xl overflow-hidden border-2 border-blue-200 bg-white">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">AquaFlow Assistant</h4>
                                    <p className="text-cyan-100 text-xs">Online • Ready to help</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsChatMinimized(!isChatMinimized)}
                                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                >
                                    {isChatMinimized ? (
                                        <Maximize2 className="h-4 w-4" />
                                    ) : (
                                        <Minimize2 className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsChatOpen(false)}
                                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {!isChatMinimized && (
                            <>
                                <div className="h-96 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        {chatMessages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'bot' && (
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                                        <Bot className="h-5 w-5 text-white" />
                                                    </div>
                                                )}
                                                <div className="max-w-[75%]">
                                                    <div
                                                        className={`rounded-2xl px-4 py-2 shadow-md ${message.role === 'user'
                                                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                                                            : 'bg-white text-gray-800 border-2 border-blue-100'
                                                            }`}
                                                    >
                                                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${message.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}
                                                        >
                                                            {message.timestamp.toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                    {message.options && message.options.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {message.options.map((option, idx) => (
                                                                <Button
                                                                    key={idx}
                                                                    size="sm"
                                                                    onClick={() => handleOptionClick(option)}
                                                                    className="text-xs bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200"
                                                                >
                                                                    {option}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={chatMessagesEndRef} />
                                    </div>
                                </div>

                                <div className="bg-white p-4 border-t-2 border-blue-100 flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit(chatInput)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <Button
                                        onClick={() => handleChatSubmit(chatInput)}
                                        disabled={!chatInput.trim()}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full h-10 w-10 p-0 shadow-lg"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </motion.div>
            )}
        </>
    );
}
