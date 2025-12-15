import React from 'react';
import Header from '../components/Header';
import WalletsSection from '../components/WalletsSection';

const Wallets = ({ onMenuClick }) => {
    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[1600px]">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wallets</h1>
                <WalletsSection />

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Wallet Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">account_balance_wallet</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-medium">Wallet Top-up</p>
                                        <p className="text-slate-500 text-sm">Chase Checking</p>
                                    </div>
                                </div>
                                <span className="text-primary font-bold">+Rp 5.000.000</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Wallets;
