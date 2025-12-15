import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsGrid = () => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Worth Card */}
            <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl text-slate-900 dark:text-white">account_balance</span>
                </div>
                <div className="flex items-start justify-between z-10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{t('stats.netWorth')}</p>
                    <span className="flex items-center text-primary text-xs bg-primary/10 px-2 py-1 rounded-full font-bold">+2.5%</span>
                </div>
                <p className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight z-10">Rp 638.895.000</p>
                <div className="h-1 w-full bg-slate-100 dark:bg-surface-dark rounded-full mt-auto mb-2 overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(19,236,182,0.5)]"></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary">arrow_downward</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('stats.income')}</span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Rp 78.000.000</p>
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    <span>+12% {t('stats.vsLastMonth')}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gradient-to-br dark:from-card-dark dark:to-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-500">arrow_upward</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('stats.expenses')}</span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Rp 21.750.000</p>
                <p className="text-red-400 text-sm font-medium flex items-center mt-1">
                    <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                    -5% {t('stats.vsLastMonth')}
                </p>
            </div>
        </div>
    );
};

export default StatsGrid;
