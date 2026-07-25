export default function Skeleton({
  variant = "line", // line, circle, rectangle
  width,
  height,
  className = "",
}) {
  const variants = {
    line: "h-3.5 w-full",
    circle: "rounded-full",
    rectangle: "rounded-lg",
  };

  return (
    <div
      className={`
        bg-bg-tertiary animate-pulse
        ${variants[variant]}
        ${className}
      `}
      style={{
        width: width || (variant === "circle" ? "40px" : "100%"),
        height: height || (variant === "circle" ? "40px" : undefined),
      }}
    />
  );
}
