import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: 'Welcome to Jyoshika Millennium Support. How can I help you with your order or a product question today?'
    }
  ]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let aiReply = "Thanks for reaching out! Let us know which product or order you'd like help with and we'll get back to you shortly.";
      if (userMsg.toLowerCase().includes('order') || userMsg.toLowerCase().includes('track')) {
        aiReply = "You can track your order anytime from the My Orders section in your account.";
      } else if (userMsg.toLowerCase().includes('return') || userMsg.toLowerCase().includes('refund')) {
        aiReply = "We offer easy 30-day returns on all products. You can start a return from your order details page.";
      } else if (userMsg.toLowerCase().includes('shipping') || userMsg.toLowerCase().includes('delivery')) {
        aiReply = "We offer free shipping on orders over ₹999, with delivery typically within 3-5 business days.";
      }
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/918867722750?text=Hello%20Jyoshika%20Millennium%2C%20I%20have%20a%20question."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
          title="Chat on WhatsApp"
        >
          <PhoneCall className="w-5 h-5" />
        </a>

        {/* AI Support Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 bg-white text-gold border border-amber-300 rounded-full shadow-xl flex items-center gap-2 hover:bg-amber-50 transition-transform hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="hidden sm:inline text-xs font-serif font-bold text-neutral-900 pr-1">Support</span>
        </button>
      </div>

      {/* Support Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-sm bg-white text-neutral-900 rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col h-[70vh] max-h-[480px]"
          >
            {/* Header */}
            <div className="p-4 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-200/60 rounded-lg text-gold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-gold">Customer Support</h4>
                  <p className="text-[10px] text-emerald-700 font-medium">● Online</p>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-neutral-50/60">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl leading-relaxed shadow-2xs ${
                      m.role === 'user'
                        ? 'bg-gold text-black font-medium rounded-br-none'
                        : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 bg-amber-50/60 border-t border-amber-200 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <button
                onClick={() => { setInput('Where is my order?'); }}
                className="px-2.5 py-1 bg-white border border-amber-200 text-neutral-700 rounded-full whitespace-nowrap hover:bg-amber-100 transition-colors"
              >
                Track My Order
              </button>
              <button
                onClick={() => { setInput('How do I return a product?'); }}
                className="px-2.5 py-1 bg-white border border-amber-200 text-neutral-700 rounded-full whitespace-nowrap hover:bg-amber-100 transition-colors"
              >
                Returns & Refunds
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-amber-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask about orders, shipping, returns..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-gold"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-gold text-black rounded-xl hover:brightness-105 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
