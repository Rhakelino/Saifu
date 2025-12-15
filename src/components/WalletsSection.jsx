import React, { useRef } from 'react';
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

// Wallet type icons and colors
const walletStyles = {
    bank: { icon: 'account_balance', gradient: 'from-[#1e1e1e] to-[#121212]' },
    cash: { icon: 'payments', gradient: 'from-green-600 to-green-800' },
    credit_card: { icon: 'credit_card', gradient: 'from-[#121212] to-[#121212]' },
    e_wallet: { icon: 'wallet', gradient: 'from-blue-600 to-blue-800' },
    crypto: { icon: 'currency_bitcoin', gradient: 'from-[#0052cc] to-[#003d99]' },
    other: { icon: 'account_balance_wallet', gradient: 'from-slate-700 to-slate-900' },
};

const WalletsSection = () => {
    const { wallets, loading } = useData();
    const scrollContainerRef = useRef(null);

    const scroll = (scrollOffset) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="lg:col-span-3 flex flex-col gap-4 w-full min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">My Wallets</h3>
                </div>
                <div className="flex overflow-x-auto hide-scroll gap-4 pb-2 w-full">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[300px] bg-slate-200 dark:bg-card-dark p-6 rounded-2xl animate-pulse h-[180px]"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-3 flex flex-col gap-4 w-full min-w-0">
            <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">My Wallets</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll(-300)}
                        className="h-8 w-8 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </button>
                    <button
                        onClick={() => scroll(300)}
                        className="h-8 w-8 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto hide-scroll gap-4 pb-2 w-full snap-x snap-mandatory"
            >
                {wallets.map((wallet) => {
                    const style = walletStyles[wallet.type] || walletStyles.other;
                    const isCredit = wallet.type === 'credit_card';

                    return (
                        <div
                            key={wallet.id}
                            className={`min-w-[300px] snap-center bg-gradient-to-br ${style.gradient} p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer`}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-6xl text-white">{wallet.icon || style.icon}</span>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                                        <span className="material-symbols-outlined text-white">{wallet.icon || style.icon}</span>
                                    </div>
                                    {wallet.accountNumber && (
                                        <p className="text-slate-400 text-sm font-medium tracking-wider">**** {wallet.accountNumber.slice(-4)}</p>
                                    )}
                                    {wallet.type === 'crypto' && (
                                        <p className="text-white/60 text-sm font-bold tracking-wider">WALLET</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">{wallet.name}</p>
                                    <p className="text-white text-2xl font-bold tracking-wider">
                                        {formatCurrency(parseFloat(wallet.balance))}
                                        {isCredit && <span className="text-xs text-slate-500 font-normal ml-2">Due</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add Wallet */}
                <div className="min-w-[100px] snap-center bg-transparent border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center h-[180px] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-black">add</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-3 font-medium group-hover:text-primary">Add New</p>
                </div>
            </div>
        </div>
    );
};

export default WalletsSection;
