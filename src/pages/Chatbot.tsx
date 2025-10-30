import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, History, Plus } from 'lucide-react';
import { ChatMessage, ChatSession } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { analyzeStress } from '../utils/stressDetection';
import { generateAIResponse } from '../utils/aiResponses';

export const Chatbot = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    } else if (user) {
      startNewSession();
    }
  }, [currentSession, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
    if (data && data.length > 0) {
      setCurrentSession(data[0]);
    }
  };

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const startNewSession = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: 'New Conversation'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setCurrentSession(data);
    await loadSessions();

    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: data.id,
      role: 'assistant',
      content: `Hello ${user.full_name}! I'm your AI mental health companion. I'm here to provide a safe, non-judgmental space for you to talk about what's on your mind.

I can help you with:
• Managing stress and anxiety
• Coping with academic pressure
• Dealing with loneliness or relationship issues
• Improving sleep and self-care
• Finding professional resources when needed

Remember, while I can offer support and coping strategies, I'm not a replacement for professional mental health care. If you're in crisis, please reach out to a crisis hotline immediately:

📞 **Call or text 988** - National Crisis Hotline (24/7)
💬 **Text HOME to 741741** - Crisis Text Line

How are you feeling today?`,
      created_at: new Date().toISOString(),
    };

    await saveMessage(welcomeMessage);
    setMessages([welcomeMessage]);
  };

  const saveMessage = async (message: ChatMessage) => {
    if (!currentSession) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSession.id,
        role: message.role,
        content: message.content,
        sentiment_score: message.sentiment_score,
        stress_level: message.stress_level,
        detected_keywords: message.detected_keywords
      });

    if (error) {
      console.error('Error saving message:', error);
    }
  };

  const updateSessionTitle = async (sessionId: string, firstUserMessage: string) => {
    const title = firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : '');

    const { error } = await supabase
      .from('chat_sessions')
      .update({
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session title:', error);
    } else {
      await loadSessions();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSession) return;

    const analysis = analyzeStress(input.trim());

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: currentSession.id,
      role: 'user',
      content: input.trim(),
      sentiment_score: analysis.sentiment_score,
      stress_level: analysis.stress_level,
      detected_keywords: analysis.detected_keywords,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);

    if (messages.length === 1) {
      await updateSessionTitle(currentSession.id, input.trim());
    }

    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const responseContent = generateAIResponse({
        userMessage: userMessage.content,
        conversationHistory,
        detectedStressLevel: analysis.stress_level,
        detectedKeywords: analysis.detected_keywords || []
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        session_id: currentSession.id,
        role: 'assistant',
        content: responseContent,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      setIsTyping(false);

      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);
    }, 1000 + Math.random() * 1000);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
    setShowHistory(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex">
      {showHistory && (
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Chat History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-600 hover:text-slate-800"
              >
                ×
              </button>
            </div>
            <button
              onClick={startNewSession}
              className="w-full px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </div>
          <div className="p-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => selectSession(session)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                  currentSession?.id === session.id
                    ? 'bg-teal-50 border-2 border-teal-300'
                    : 'hover:bg-slate-50 border-2 border-transparent'
                }`}
              >
                <div className="font-medium text-slate-800 text-sm truncate">
                  {session.title}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(session.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Chat History"
            >
              <History className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">AI Mental Health Companion</h1>
              <p className="text-sm text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Empathetic listening and evidence-based support
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

                <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
                  <div
                    className={`rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-teal-400 to-blue-500 text-white'
                        : 'bg-white text-slate-800 shadow-lg'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && message.stress_level && (
                    <div className={`text-xs mt-1 px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block px-2 py-1 rounded ${
                        message.stress_level === 'critical' ? 'bg-red-100 text-red-800' :
                        message.stress_level === 'high' ? 'bg-orange-100 text-orange-800' :
                        message.stress_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {message.stress_level} stress
                      </span>
                    </div>
                  )}
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
    </div>
  );
};
