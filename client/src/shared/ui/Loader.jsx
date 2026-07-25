export default function Loader({ fullScreen = false, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center animate-reveal ${
        fullScreen ? "min-h-screen bg-bg-primary" : "py-8 w-full"
      } ${className}`}
    >
      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
