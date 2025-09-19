/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppSelector } from '../hooks/redux';

const COLORS = [
  '#10b981', // green
  '#a78bfa', // purple  
  '#60a5fa', // blue
  '#18c9dc', // cyan
  '#fb923c', // orange
  '#fb7185', // rose
];

export const PortfolioDonutChart: React.FC = () => {
  const tokens = useAppSelector(state => state.portfolio.tokens);
  
  const portfolioData = tokens?.filter(token => token.holdings > 0)?.map((token, index) => ({
      name: `${token.name} (${token.symbol})`,
      value: token.holdings * token.price,
      percentage: 0, // Will be calculated below
      color: COLORS[index % COLORS.length],
    }));

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages
  portfolioData?.forEach(item => {item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0});

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="text-zinc-100 font-medium">{data.name}</p>
          <p className="text-zinc-400 text-sm">
            ${data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-zinc-400 text-sm">
            {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (portfolioData.length === 0) {
    return (
      <div className="w-[161px] h-[161px] flex items-center justify-center">
        <div className="text-zinc-500 text-sm text-center">
          No holdings
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width={161} height={161}>
      <PieChart>
        <Pie
          data={portfolioData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {portfolioData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};