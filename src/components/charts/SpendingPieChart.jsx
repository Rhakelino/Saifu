import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Food', value: 4500000 },
    { name: 'Transport', value: 2100000 },
    { name: 'Shopping', value: 3200000 },
    { name: 'Rent', value: 8500000 },
    { name: 'Others', value: 1500000 },
];

const COLORS = ['#13ecb6', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] p-3 rounded-lg shadow-xl">
                <p className="text-[var(--chart-tooltip-text)] font-medium">
                    {payload[0].name}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const SpendingPieChart = () => {
    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
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
