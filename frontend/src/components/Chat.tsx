import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';

export const BuddyChat: React.FC = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string, unsafe?: boolean }[]>([
        { role: 'assistant', text: 'Greetings. I am your Safety Monitoring Assistant. How can I assist you with governance queries today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Hardcoded district context for now
            const res = await api.chat(userMsg, "D1");
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: res.data.response,
                unsafe: res.data.safety_flag
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error: Unable to connect to AI Service." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                <span className="font-bold text-blue-300">Buddy Chat Support</span>
                <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">AI-Powered</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${m.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : m.unsafe
                                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                                    : 'bg-slate-700 text-slate-200'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-xs text-slate-500 animate-pulse ml-2">Processing...</div>}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about safety protocols..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
};
