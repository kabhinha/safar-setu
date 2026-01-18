import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Bot, User, Sparkles } from 'lucide-react';
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
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0a0a0a] pb-24">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md p-4 border-b border-white/5 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-tight">AI Companion</h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex gap-3", msg.sender === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                            msg.sender === 'user' ? "bg-white/10 border-white/5" : "bg-blue-500/10 border-blue-500/30"
                        )}>
                            {msg.sender === 'user' ? <User className="h-4 w-4 text-gray-300" /> : <Bot className="h-4 w-4 text-blue-400" />}
                        </div>
                        <div className={cn(
                            "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                            msg.sender === 'user'
                                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20"
                                : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm"
                        )}>
                            <p>{msg.text}</p>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <p className="text-[10px] uppercase tracking-widest text-blue-400/80 mb-2">Sources</p>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.citations.map(c => (
                                            <span key={c} className="text-xs bg-black/30 border border-white/10 px-2.5 py-1 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-[#0a0a0a] border-t border-white/5">
                <div className="relative flex items-center gap-2">
                    <Input
                        className="flex-1 bg-white/5 border-white/10 focus:border-blue-500/50 min-h-[50px] rounded-full px-6"
                        placeholder="Query neural network..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        disabled={!input.trim()}
                    >
                        <Send className="h-5 w-5 ml-0.5 mt-0.5" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
