import { useState, useRef, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import Logo from './Logo';

const RefinePage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [mode, setMode] = useState('chatgpt');
  const [language, setLanguage] = useState('english');
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  const modes = [
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'claude', label: 'Claude' },
    { value: 'coding', label: 'Coding' },
    { value: 'creative', label: 'Creative' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'teaching', label: 'Teaching' },
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'spanish', label: 'Spanish' },
  ];

 useEffect(() => {
  if (outputText && outputRef.current) {
    outputRef.current.scrollTop = 0; // Scroll to TOP to see refined prompt from start
  }
}, [outputText]);


  const handleRefine = async () => {
  if (!inputText.trim()) return;
  
  setIsRefining(true);
  setOutputText("");

  try {
    const response = await fetch("https://orbixbackendv1.onrender.com/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        input: inputText, 
        mode: mode,
        language: language 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setOutputText(data.refined || "⚠️ No refined output received");
  } catch (error) {
    setOutputText("❌ Connection Error: " + error.message + "\n\nMake sure backend is running on http://localhost:5140");
  } finally {
    setIsRefining(false);
  }
};


  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-white/[0.08] bg-white/50 dark:bg-[#0d0d0d]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Refiner</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transform your prompts into optimized instructions</p>
              </div>
            </div>
            {(inputText || outputText) && (
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: Input Panel */}
            <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border-2 border-gray-300 dark:border-white/[0.1] rounded-2xl shadow-xl">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-white/[0.08]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Raw Prompt</h2>
              </div>
              
              <div className="flex-1 p-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleRefine();
                    }
                  }}
                  placeholder="Enter your prompt here... (Ctrl+Enter to refine)"
                  style={{ minHeight: '400px' }}
                  className="w-full h-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-white/[0.1] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-white/[0.3] resize-none text-sm leading-relaxed"
                />
              </div>

              {/* Controls - Always Visible at Bottom */}
              <div className="p-6 pt-4 border-t border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-[#0d0d0d]/50">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Select.Root value={mode} onValueChange={setMode}>
                    <Select.Trigger className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/[0.1] text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      <Select.Value />
                      <Select.Icon>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-[#141414] rounded-xl border-2 border-gray-300 dark:border-white/[0.15] shadow-2xl z-50" position="popper" sideOffset={8}>
                        <Select.Viewport className="p-2">
                          {modes.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-lg cursor-pointer outline-none"
                            >
                              <Select.ItemText>{m.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <Select.Root value={language} onValueChange={setLanguage}>
                    <Select.Trigger className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/[0.1] text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      <Select.Value />
                      <Select.Icon>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-[#141414] rounded-xl border-2 border-gray-300 dark:border-white/[0.15] shadow-2xl z-50" position="popper" sideOffset={8}>
                        <Select.Viewport className="p-2">
                          {languages.map((l) => (
                            <Select.Item
                              key={l.value}
                              value={l.value}
                              className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-lg cursor-pointer outline-none"
                            >
                              <Select.ItemText>{l.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <button
                  onClick={handleRefine}
                  disabled={!inputText.trim() || isRefining}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black font-semibold hover:shadow-xl hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                >
                  {isRefining ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refining...
                    </span>
                  ) : 'Refine Prompt'}
                </button>
              </div>
            </div>

            {/* RIGHT: Output Panel */}
            <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border-2 border-gray-300 dark:border-white/[0.1] rounded-2xl shadow-xl">
              <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-200 dark:border-white/[0.08]">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Refined Output</h2>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.12] rounded-lg transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 p-6">
                {!outputText ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center px-6">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your refined prompt will appear here</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Enter a prompt and click "Refine" to start</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={outputRef}
                    className="h-full min-h-[400px] overflow-y-auto"
                  >
                    <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0d0d0d] dark:to-[#141414] border border-gray-200 dark:border-white/[0.08] p-5">
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {outputText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinePage;
