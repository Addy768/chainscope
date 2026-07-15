export default function Skeleton({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-border"
          style={{ width: `${65 + ((i * 37) % 30)}%` }}
        />
      ))}
    </div>
  );
}
