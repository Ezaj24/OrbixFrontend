const ModeSwitch = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.08] border border-gray-300 dark:border-white/[0.1]">
      <button
        onClick={() => onModeChange('chat')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentMode === 'chat'
            ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => onModeChange('refine')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentMode === 'refine'
            ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        Refine
      </button>
    </div>
  );
};

export default ModeSwitch;
