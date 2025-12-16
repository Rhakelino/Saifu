
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Loader2, BarChart3 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const formatCurrency = (value) => {
    if (value >= 1000000) {
        const millions = value / 1000000;
        // Show decimal only if not a whole number
        return `Rp${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} jt`;
    }
    if (value >= 1000) {
        return `Rp${(value / 1000).toFixed(0)} rb`;
    }
    return `Rp${value} `;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] p-4 rounded-lg shadow-xl">
                <p className="text-[var(--chart-tooltip-text)] font-bold mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                        {entry.name === 'income' ? 'Income' : 'Expenses'}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const IncomeAreaChart = () => {
    const { stats, loading } = useData();

    // Transform monthlyData from stats to chart format
    const chartData = React.useMemo(() => {
        if (!stats?.monthlyData) return [];

        // Convert monthlyData object to array and sort by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return stats.monthlyData.map(item => {
            // item.month format is 'YYYY-MM', extract the month number
            const monthPart = item.month?.split('-')[1];
            const monthIndex = monthPart ? parseInt(monthPart, 10) - 1 : -1;

            return {
                name: months[monthIndex] || item.month,
                income: parseFloat(item.income) || 0,
                expense: parseFloat(item.expenses) || 0,
            };
        });
    }, [stats?.monthlyData]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-2 text-slate-300 dark:text-white/20" />
                    <p>Loading chart data...</p>
                </div>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <BarChart3 className="w-12 h-12 mb-2 text-slate-300 dark:text-white/20" />
                    <p>No income data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#13ecb6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#13ecb6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="var(--chart-axis-stroke)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--chart-axis-stroke)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatCurrency}
                        domain={[0, 2000000]}
                        ticks={[0, 500000, 1000000, 1500000, 2000000]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#13ecb6"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeAreaChart;
