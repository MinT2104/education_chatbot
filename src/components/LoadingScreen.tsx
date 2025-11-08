const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
