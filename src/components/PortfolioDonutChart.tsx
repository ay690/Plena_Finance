/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppSelector } from '../hooks/redux';

const COLORS = [
  '#10b981', // green
  '#a78bfa', // purple  
  '#60a5fa', // blue
  '#18c9dc', // cyan
  '#fb923c', // orange
  '#fb7185', // rose
];

type DonutProps = {
  width?: number | string; // container width, e.g., number in px or '100%'
  height?: number | string; // container height
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
};

export const PortfolioDonutChart: React.FC<DonutProps> = ({
  width = 161,
  height = 161,
  innerRadius = 50,
  outerRadius = 80,
  className = "",
}) => {
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

  return (
    <div className={className} style={{ width, height }}>
      <AnimatePresence mode="wait">
        {portfolioData.length === 0 ? (
          <motion.div
            key="empty"
            className="flex items-center justify-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-zinc-500 text-sm text-center">No holdings</div>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};