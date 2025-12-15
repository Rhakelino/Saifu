import React from 'react';
import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import IncomeAreaChart from '../components/charts/IncomeAreaChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';

const Analytics = ({ onMenuClick }) => {
    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[1600px]">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                <StatsGrid />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 h-96 flex flex-col shadow-sm dark:shadow-none">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Income vs Expenses</h3>
                            <select className="bg-slate-50 dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-sm rounded-lg p-2 border border-slate-200 dark:border-none outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <IncomeAreaChart />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 h-96 flex flex-col shadow-sm dark:shadow-none">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Spending by Category</h3>
                        <div className="flex-1 w-full min-h-0">
                            <SpendingPieChart />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Analytics;
