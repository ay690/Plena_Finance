import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: number[];
  isPositive: boolean;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, isPositive }) => {
  const chartData = data?.map((value, index) => ({ value, index }));
  const color = isPositive ? '#10b981' : '#ef4444';

  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};