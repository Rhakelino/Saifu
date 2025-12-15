import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ onMenuClick }) => {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dashboard.greeting')}</p>
                    <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">{t('dashboard.title')}</h2>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex bg-slate-100 dark:bg-card-dark rounded-lg p-1 border border-slate-200 dark:border-white/5">
                    <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm">{t('dashboard.thisMonth')}</button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('dashboard.lastMonth')}</button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t('dashboard.ytd')}</button>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold shadow-[0_0_15px_rgba(19,236,182,0.3)] transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="hidden sm:inline">{t('dashboard.addTransaction')}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
