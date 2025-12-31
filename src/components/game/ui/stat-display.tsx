'use client';

interface StatDisplayProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export function StatDisplay({ label, value, valueClassName = "text-white font-bold" }: StatDisplayProps) {
  return (
    <div className="text-center">
      <div className="text-gray-400 text-xs">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}
