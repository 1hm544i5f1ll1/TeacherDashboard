import React from 'react';

interface SimpleChartProps {
  data: number[];
  color: string;
}

export function SimpleChart({ data, color }: SimpleChartProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  
  return (
    <div className="w-full h-20">
      <div className="flex items-end justify-between h-full space-x-1">
        {data.map((value, index) => {
          const height = maxValue === minValue ? 50 : ((value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 ${
                color === 'blue' ? 'bg-blue-500' :
                color === 'green' ? 'bg-green-500' :
                color === 'yellow' ? 'bg-yellow-500' :
                color === 'purple' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
