import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.full_name}! I'm your AI mental health companion. I'm here to provide a safe, non-judgmental space for you to talk about what's on your mind. Remember, while I can offer support and coping strategies, I'm not a replacement for professional mental health care. If you're in crisis, please reach out to a crisis hotline immediately (call or text 988).\n\nHow are you feeling today?`,
      created_at: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
      return `I'm very concerned about what you're sharing. Your life matters, and help is available right now. Please:\n\n📞 Call or text 988 (National Crisis Hotline)\n💬 Text HOME to 741741 (Crisis Text Line)\n🌐 Visit findahelpline.com for international support\n\nThese services are free, confidential, and available 24/7. You don't have to face this alone. Would you like me to help you find additional resources?`;
    }

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('panic')) {
      return `I hear that you're experiencing anxiety. That's a very common feeling, especially for students. Here are some immediate strategies that might help:\n\n🌊 Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.\n\n✋ Use the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.\n\n💭 Remember: Anxiety is uncomfortable but not dangerous. It will pass.\n\nWould you like to explore what's triggering your anxiety, or would you prefer more coping techniques?`;
    }

    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return `Feeling stressed and overwhelmed is tough, especially with academic pressures. Let's break this down:\n\n📝 What's the biggest source of stress right now? Sometimes naming it helps reduce its power.\n\n⏰ Remember: You can only do one thing at a time. What's the most important task today?\n\n🛑 Don't forget self-compassion. You're doing your best in challenging circumstances.\n\nWould it help to talk through your stressors, or would you like some specific stress management strategies?`;
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
      return `Sleep problems can really impact mental health. Here are some evidence-based tips:\n\n🌙 Maintain consistent sleep/wake times (even on weekends)\n📱 Avoid screens 1 hour before bed (blue light affects melatonin)\n☕ Cut caffeine after 2pm\n🧘 Try a relaxation routine: gentle stretching, reading, or meditation\n🌡️ Keep your room cool (60-67°F is optimal)\n\nPoor sleep often improves with consistent habits over 1-2 weeks. Are you dealing with racing thoughts at night, or is it more about habits?`;
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return `Feeling lonely is painful, and it's important that you're acknowledging it. Connection is a fundamental human need. Some thoughts:\n\n💙 Loneliness is common among students - you're not alone in feeling alone.\n\n🤝 Small connections matter: saying hi to a classmate, joining a study group, or attending a campus event.\n\n📞 Reaching out takes courage. Can you think of one person you could message today?\n\n🎯 Consider joining a club or activity aligned with your interests.\n\nWhat feels most achievable for you right now?`;
    }

    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('studying')) {
      return `Academic stress around exams is so common. Let's work through this:\n\n📚 Break study into 25-minute focused sessions (Pomodoro technique)\n📅 Create a realistic study schedule - cramming increases anxiety\n✅ Focus on understanding, not perfection\n🧠 Your brain needs breaks to consolidate information\n😌 Remember: one exam doesn't define you or your future\n\nWhat specific aspect of exam prep is most stressful for you?`;
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('helpful')) {
      return `You're very welcome! I'm glad I could help. Remember, taking care of your mental health is a sign of strength. Keep checking in with yourself, practice self-compassion, and don't hesitate to reach out for support when you need it.\n\nIs there anything else on your mind today?`;
    }

    return `Thank you for sharing that with me. I want to make sure I understand and can provide the most helpful response. Could you tell me a bit more about what you're experiencing?\n\nSome things that might help me support you better:\n• How long have you been feeling this way?\n• What situations or thoughts trigger these feelings?\n• What have you tried so far that has helped (even a little)?\n• Are you getting enough sleep, nutrition, and movement?\n\nRemember, there's no wrong answer. This is a safe space for you.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseContent = generateResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Mental Health Companion</h1>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Trained in supportive listening and coping strategies
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-teal-400 to-blue-500 text-white'
                    : 'bg-white text-slate-800 shadow-lg'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-xl" />
                  ) : (
                    <User className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            This AI provides support but is not a replacement for professional mental health care
          </p>
        </form>
      </div>
    </div>
  );
};
