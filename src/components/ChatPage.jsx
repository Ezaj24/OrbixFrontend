import { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

const ChatPage = ({ currentMessages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [currentMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userInput = inputText.trim();
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5140/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "⚠️ No response from server";
      
      onSendMessage(userInput, aiResponse);
    } catch (error) {
      const errorMsg = "❌ Connection Error: " + error.message + "\n\nMake sure backend is running on http://localhost:5140";
      onSendMessage(userInput, errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        ref={chatRef}
        className={`flex-1 ${currentMessages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden flex items-center justify-center'}`}
      >
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
          
          {currentMessages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center">
              <div className="mb-10">
                <Logo size="lg" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent mb-3">
                Welcome to ORBIX Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                Ask me anything. I'm here to help.
              </p>
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                <button
                  onClick={() => setInputText("Explain quantum computing in simple terms")}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.12] rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                >
                  💡 Explain quantum computing
                </button>
                <button
                  onClick={() => setInputText("Write a professional email")}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.12] rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                >
                  ✉️ Write an email
                </button>
                <button
                  onClick={() => setInputText("Help me brainstorm startup ideas")}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.12] rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                >
                  🚀 Brainstorm ideas
                </button>
              </div>
            </div>
          )}

          {currentMessages.map((msg, index) => (
            <div key={index} className="mb-8 animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">You</span>
              </div>
              <div className="ml-9 p-4 rounded-xl bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]">
                <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {msg.userInput}
                </p>
              </div>

              <div className="mt-6 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo size="md" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ORBIX</span>
                </div>
                <button
                  onClick={() => handleCopy(msg.aiResponse)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.12] rounded-lg transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="ml-9 p-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#141414] dark:via-[#111111] dark:to-[#0d0d0d] border-2 border-gray-300 dark:border-white/[0.12] shadow-xl">
                <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {msg.aiResponse}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-8 animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <Logo size="md" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ORBIX</span>
              </div>
              <div className="ml-9 p-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#141414] dark:via-[#111111] dark:to-[#0d0d0d] border-2 border-gray-300 dark:border-white/[0.12] shadow-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-white/[0.1] bg-white/70 dark:bg-[#0d0d0d]/70 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="w-full min-h-[120px] max-h-[300px] px-5 py-4 pr-14 rounded-2xl border-2 border-gray-300 dark:border-white/[0.15] bg-white dark:bg-[#141414] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-white/[0.3] resize-none text-[15px] leading-relaxed transition-all duration-200 shadow-lg"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-3 bottom-3 w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 hover:shadow-2xl hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
            >
              {isLoading ? (
                <svg className="w-5 h-5 text-white dark:text-black animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
