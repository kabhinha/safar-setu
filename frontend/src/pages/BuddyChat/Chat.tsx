import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Bot } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    citations?: string[];
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Greetings. I am your neural interface for the North East. How may I assist your exploration today?", sender: 'bot', citations: [] },
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now(), text: input, sender: 'user', citations: [] };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock response
        setTimeout(() => {
            const botMsg: Message = {
                id: Date.now() + 1,
                text: "Analysis suggests Ziro Valley matches your parameters. It offers optimal conditions for cultural immersion.",
                sender: 'bot',
                citations: ['Ziro Valley Sanctuary']
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 pt-[56px] pb-20">
            <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-[56px] z-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <Bot className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 text-sm tracking-wide">OFFICIAL ASSISTANT</h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Automated</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex gap-3", msg.sender === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border text-xs",
                            msg.sender === 'user' ? "bg-slate-200 border-slate-300 text-slate-600" : "bg-white border-slate-200 text-slate-600"
                        )}>
                            {msg.sender === 'user' ? "You" : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed border",
                            msg.sender === 'user'
                                ? "bg-slate-800 text-white border-slate-700"
                                : "bg-white text-slate-800 border-slate-200"
                        )}>
                            <p>{msg.text}</p>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">References</p>
                                    <div className="flex flex-wrap gap-1">
                                        {msg.citations.map(c => (
                                            <span key={c} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="relative flex items-center gap-2">
                    <Input
                        className="flex-1 bg-white border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 min-h-[44px] rounded-lg px-4 text-slate-800"
                        placeholder="Type an official inquiry..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        className="rounded-lg w-12 h-11 p-0 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white border-none shadow-sm"
                        disabled={!input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
