export default function Card({ children, className = "", hoverable = false }) {
  return (
    <div
      className={`
        relative rounded-lg border border-border-color bg-bg-secondary transition-all duration-300
        ${hoverable ? "hover:border-brand/30 hover:shadow-lg" : ""}
        ${className}
      `}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}
