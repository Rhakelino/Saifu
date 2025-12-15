import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', income: 40000000, expense: 24000000 },
    { name: 'Feb', income: 30000000, expense: 13980000 },
    { name: 'Mar', income: 20000000, expense: 98000000 },
    { name: 'Apr', income: 27800000, expense: 39080000 },
    { name: 'May', income: 18900000, expense: 48000000 },
    { name: 'Jun', income: 23900000, expense: 38000000 },
    { name: 'Jul', income: 34900000, expense: 43000000 },
];

const formatCurrency = (value) => {
    if (value >= 1000000) {
        return `Rp${(value / 1000000).toFixed(0)}M`;
    }
    return `Rp${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] p-4 rounded-lg shadow-xl">
                <p className="text-[var(--chart-tooltip-text)] font-bold mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                        {entry.name === 'income' ? 'Income' : 'Expenses'}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const IncomeAreaChart = () => {
    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
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
