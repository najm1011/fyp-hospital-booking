import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({
  message = 'Loading...',
  fullScreen = true,
  transparent = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0';

  const bgClasses = transparent
    ? 'bg-white/80 backdrop-blur-sm'
    : 'bg-white';

  return (
    <div className={`${containerClasses} ${bgClasses} flex flex-col items-center justify-center`}>
      <LoadingSpinner size="xl" color="blue" />
      {message && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default PageLoader;
