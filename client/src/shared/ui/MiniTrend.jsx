export default function MiniTrend({
  data = [],
  width = 80,
  height = 24,
  type = "up", // up, down
  className = "",
}) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          className={`${type === "up" ? "stroke-emerald-500" : "stroke-red-500"}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}
