import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';

// Default colors for categories
const COLORS = ['#13ecb6', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4', '#22c55e'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const percentage = ((payload[0].value / payload[0].payload.total) * 100).toFixed(1);
        return (
            <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] p-3 rounded-lg shadow-xl">
                <p className="text-[var(--chart-tooltip-text)] font-medium">
                    {payload[0].name}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payload[0].value)}
                </p>
                <p className="text-slate-400 text-xs mt-1">{percentage}% of total</p>
            </div>
        );
    }
    return null;
};

const SpendingPieChart = () => {
    const { stats, loading } = useData();

    // Transform spendingByCategory from stats to chart format
    const chartData = React.useMemo(() => {
        if (!stats?.spendingByCategory || stats.spendingByCategory.length === 0) return [];

        const total = stats.spendingByCategory.reduce((sum, cat) => sum + parseFloat(cat.total || 0), 0);

        return stats.spendingByCategory.map((cat, index) => ({
            name: cat.categoryName || 'Other',
            value: parseFloat(cat.total) || 0,
            color: cat.categoryColor || COLORS[index % COLORS.length],
            total: total,
        }));
    }, [stats?.spendingByCategory]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-white/20 animate-spin">progress_activity</span>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-white/20">pie_chart</span>
                <p className="text-slate-400 mt-2">No expense data yet</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || COLORS[index % COLORS.length]}
                                stroke="rgba(0,0,0,0)"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingPieChart;
