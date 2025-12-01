import { useState, useEffect } from 'react';
import Logo from './components/Logo';
import ModeSwitch from './components/ModeSwitch';
import ProfileMenu from './components/ProfileMenu';
import ChatPage from './components/ChatPage';
import RefinePage from './components/RefinePage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

   useEffect(() => {
  // Dark mode as default
  const isDark = localStorage.theme === 'dark' || !('theme' in localStorage);
  setDarkMode(isDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  const savedSessions = localStorage.getItem('orbix_chat_sessions');
  if (savedSessions) {
    setChatSessions(JSON.parse(savedSessions));
  }
}, []);


  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const newChat = () => {
    setCurrentChatId(null);
    setCurrentMessages([]);
    setSidebarOpen(false);
  };

  const goToHome = () => {
    setCurrentMode('chat');
    newChat();
  };

  const saveMessage = (userInput, aiResponse) => {
    const timestamp = new Date().toISOString();
    const newMessage = { userInput, aiResponse, timestamp };

    if (currentChatId) {
      // Add to existing chat
      const updatedSessions = chatSessions.map(session => {
        if (session.id === currentChatId) {
          return {
            ...session,
            messages: [...session.messages, newMessage],
            lastUpdated: timestamp,
          };
        }
        return session;
      });
      setChatSessions(updatedSessions);
      localStorage.setItem('orbix_chat_sessions', JSON.stringify(updatedSessions));
      
      const currentSession = updatedSessions.find(s => s.id === currentChatId);
      setCurrentMessages(currentSession.messages);
    } else {
      // Create new chat session
      const newChatId = Date.now();
      const newSession = {
        id: newChatId,
        title: userInput.substring(0, 60),
        messages: [newMessage],
        createdAt: timestamp,
        lastUpdated: timestamp,
      };
      const updatedSessions = [newSession, ...chatSessions];
      setChatSessions(updatedSessions);
      localStorage.setItem('orbix_chat_sessions', JSON.stringify(updatedSessions));
      setCurrentChatId(newChatId);
      setCurrentMessages([newMessage]);
    }
  };

  const loadChat = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentChatId(session.id);
      setCurrentMessages(session.messages);
      setSidebarOpen(false);
    }
  };

  const clearAllChats = () => {
    if (confirm('Clear all chat history? This cannot be undone.')) {
      setChatSessions([]);
      setCurrentChatId(null);
      setCurrentMessages([]);
      localStorage.removeItem('orbix_chat_sessions');
      setSettingsOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0d0d0d] dark:via-[#111111] dark:to-[#0d0d0d] transition-all duration-500">
      
      {/* Sidebar (only for Chat mode) */}
      {currentMode === 'chat' && (
        <>
          <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-2xl border-r border-gray-300 dark:border-white/[0.1] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-300 dark:border-white/[0.1] flex items-center justify-between flex-shrink-0">
                <button
                  onClick={newChat}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 hover:shadow-lg text-sm font-medium text-white dark:text-black transition-all duration-200 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Chat
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-2 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No chats yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a conversation</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => loadChat(session.id)}
                        className={`w-full text-left px-3 py-3 rounded-xl border transition-all duration-200 ${
                          currentChatId === session.id
                            ? 'bg-gray-200 dark:bg-white/[0.12] border-gray-400 dark:border-white/[0.2]'
                            : 'bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.08] border-gray-300 dark:border-white/[0.06]'
                        }`}
                      >
                        <p className="text-sm text-gray-900 dark:text-gray-200 truncate font-medium">{session.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(session.lastUpdated).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            • {session.messages.length} {session.messages.length === 1 ? 'message' : 'messages'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {chatSessions.length > 0 && (
                <div className="p-4 border-t border-gray-300 dark:border-white/[0.1] flex-shrink-0">
                  <button
                    onClick={clearAllChats}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.1] rounded-xl transition-colors"
                  >
                    Clear All Chats
                  </button>
                </div>
              )}
            </div>
          </div>

          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSettingsOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border-2 border-gray-300 dark:border-white/[0.15] shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.05] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Toggle dark/light theme</p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {/* Clear Memory */}
                <div className="p-4 bg-red-50 dark:bg-red-500/[0.1] rounded-xl border border-red-200 dark:border-red-500/[0.3]">
                  <div className="flex items-start gap-3 mb-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-200">Clear All Chat Memory</p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        This will permanently delete all your chat history ({chatSessions.length} {chatSessions.length === 1 ? 'chat' : 'chats'}). This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearAllChats}
                    disabled={chatSessions.length === 0}
                    className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {chatSessions.length === 0 ? 'No Chats to Clear' : 'Clear All Memory'}
                  </button>
                </div>

                {/* Stats */}
                <div className="p-4 bg-gray-50 dark:bg-white/[0.05] rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Statistics</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{chatSessions.length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Chats</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {chatSessions.reduce((sum, session) => sum + session.messages.length, 0)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Messages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-white/[0.1] bg-white/70 dark:bg-[#0d0d0d]/70 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            {currentMode === 'chat' && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all duration-200 active:scale-95"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <button
              onClick={goToHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Logo size="md" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                ORBIX
              </h1>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ModeSwitch currentMode={currentMode} onModeChange={setCurrentMode} />
            <ProfileMenu darkMode={darkMode} toggleDarkMode={toggleDarkMode} onOpenSettings={() => setSettingsOpen(true)} />
          </div>
        </div>

        {/* Page Content */}
        {currentMode === 'chat' ? (
          <ChatPage 
            currentMessages={currentMessages}
            onSendMessage={saveMessage}
          />
        ) : (
          <RefinePage />
        )}
      </div>
    </div>
  );
}

export default App;
