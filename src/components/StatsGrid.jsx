import React from 'react';
import { useData } from '../context/DataContext';

// Format number to Indonesian Rupiah
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
};

const StatsGrid = () => {
    const { stats, loading } = useData();

    // Calculate percentage changes from monthlyData
    const changes = React.useMemo(() => {
        if (!stats?.monthlyData || stats.monthlyData.length < 2) {
            return { income: null, expense: null, net: null };
        }

        const sortedMonths = [...stats.monthlyData].sort((a, b) => {
            const aDate = new Date(a.year || 2024, parseInt(a.month) - 1);
            const bDate = new Date(b.year || 2024, parseInt(b.month) - 1);
            return bDate - aDate;
        });

        const currentMonth = sortedMonths[0];
        const lastMonth = sortedMonths[1];

        if (!currentMonth || !lastMonth) {
            return { income: null, expense: null, net: null };
        }

        const currIncome = parseFloat(currentMonth.income) || 0;
        const prevIncome = parseFloat(lastMonth.income) || 0;
        const currExpense = parseFloat(currentMonth.expense) || 0;
        const prevExpense = parseFloat(lastMonth.expense) || 0;

        const incomeChange = prevIncome > 0 ? ((currIncome - prevIncome) / prevIncome) * 100 : 0;
        const expenseChange = prevExpense > 0 ? ((currExpense - prevExpense) / prevExpense) * 100 : 0;

        return {
            income: { value: Math.abs(incomeChange).toFixed(0), isPositive: incomeChange >= 0 },
            expense: { value: Math.abs(expenseChange).toFixed(0), isPositive: expenseChange <= 0 },
            net: null,
        };
    }, [stats?.monthlyData]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 shadow-lg animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div>
                        <div className="h-10 bg-slate-200 dark:bg-white/10 rounded w-48"></div>
                        <div className="h-1 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    const netWorth = stats?.netWorth || 0;
    const totalIncome = stats?.totalIncome || 0;
    const totalExpenses = stats?.totalExpenses || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Worth Card */}
            <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl text-slate-900 dark:text-white">account_balance</span>
                </div>
                <div className="flex items-start justify-between z-10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Net Worth</p>
                    {savingsRate > 0 && (
                        <span className="flex items-center text-primary text-xs bg-primary/10 px-2 py-1 rounded-full font-bold">
                            {savingsRate.toFixed(0)}% saved
                        </span>
                    )}
                </div>
                <p className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight z-10">{formatCurrency(netWorth)}</p>
                <div className="h-1 w-full bg-slate-100 dark:bg-surface-dark rounded-full mt-auto mb-2 overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(19,236,182,0.5)]"
                        style={{ width: `${Math.min(savingsRate, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Income Card */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary">arrow_downward</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total Income</span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{formatCurrency(totalIncome)}</p>
                {changes.income && (
                    <div className={`mt-4 flex items-center gap-2 text-sm font-medium ${changes.income.isPositive ? 'text-primary bg-primary/10' : 'text-red-400 bg-red-500/10'
                        } w-fit px-2 py-1 rounded-md`}>
                        <span className="material-symbols-outlined text-base">
                            {changes.income.isPositive ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{changes.income.isPositive ? '+' : '-'}{changes.income.value}% vs last month</span>
                    </div>
                )}
            </div>

            {/* Expenses Card */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-500">arrow_upward</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total Expenses</span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{formatCurrency(totalExpenses)}</p>
                {changes.expense && (
                    <p className={`text-sm font-medium flex items-center mt-4 ${changes.expense.isPositive ? 'text-primary' : 'text-red-400'
                        }`}>
                        <span className="material-symbols-outlined text-sm mr-1">
                            {changes.expense.isPositive ? 'trending_down' : 'trending_up'}
                        </span>
                        {changes.expense.isPositive ? '-' : '+'}{changes.expense.value}% vs last month
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatsGrid;
