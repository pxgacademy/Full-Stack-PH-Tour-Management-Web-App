//
const LoadingText = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingText;
