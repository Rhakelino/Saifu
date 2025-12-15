import React from 'react';
import { useTranslation } from 'react-i18next';

const TransactionsSection = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">{t('transactions.title')}</h3>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => alert("CSV Export feature is coming soon!")}
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        {t('transactions.printCsv')}
                    </button>
                    <a href="#" className="text-primary text-sm font-medium hover:underline">{t('common.viewAll')}</a>
                </div>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">{t('transactions.table.transaction')}</th>
                            <th className="px-6 py-4">{t('transactions.table.category')}</th>
                            <th className="px-6 py-4">{t('transactions.table.date')}</th>
                            <th className="px-6 py-4 text-right">{t('transactions.table.amount')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#E50914] text-white flex items-center justify-center">
                                        <span className="font-bold text-xs">N</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium text-sm">Netflix Subscription</p>
                                        <p className="text-slate-500 text-xs">Chase Checking</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                    Entertainment
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">Oct 24, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-slate-900 dark:text-white font-medium text-sm">-$15.99</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium text-sm">Tech Solutions Inc.</p>
                                        <p className="text-slate-500 text-xs">Salary Deposit</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    Income
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">Oct 23, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-primary font-bold text-sm">+Rp 37.500.000</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#006241] text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">coffee</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium text-sm">Starbucks</p>
                                        <p className="text-slate-500 text-xs">Amex Gold</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                    Food & Drink
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">Oct 22, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-slate-900 dark:text-white font-medium text-sm">-Rp 97.500</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">bolt</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium text-sm">Electric Company</p>
                                        <p className="text-slate-500 text-xs">Chase Checking</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                    Utilities
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">Oct 20, 2023</td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-slate-900 dark:text-white font-medium text-sm">-$124.30</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsSection;
