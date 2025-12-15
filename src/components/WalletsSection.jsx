import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const WalletsSection = () => {
    const { t } = useTranslation();
    const scrollContainerRef = useRef(null);

    const scroll = (scrollOffset) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="lg:col-span-3 flex flex-col gap-4 w-full min-w-0">
            <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">{t('wallets.title')}</h3>
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
                {/* Wallet 1 */}
                <div className="min-w-[300px] snap-center bg-gradient-to-br from-[#1e1e1e] to-[#121212] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl text-white">account_balance</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-8">
                            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                                <span className="material-symbols-outlined text-white">account_balance</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium tracking-wider">**** 4582</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Chase Checking</p>
                            <p className="text-white text-2xl font-bold tracking-wider">Rp 36.000.000</p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="min-w-[300px] snap-center bg-[#121212] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl text-white">credit_card</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-8">
                            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                                <span className="material-symbols-outlined text-white">credit_card</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium tracking-wider">**** 9012</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Amex Gold</p>
                            <p className="text-white text-2xl font-bold tracking-wider">Rp 6.750.000 <span className="text-xs text-slate-500 font-normal">{t('wallets.due')}</span></p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="min-w-[300px] snap-center bg-gradient-to-br from-[#0052cc] to-[#003d99] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl text-white">currency_bitcoin</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-8">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                <span className="material-symbols-outlined text-white">currency_bitcoin</span>
                            </div>
                            <p className="text-white/60 text-sm font-bold tracking-wider">WALLET</p>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Coinbase</p>
                            <p className="text-white text-2xl font-bold tracking-wider">Rp 180.000.000</p>
                        </div>
                    </div>
                </div>{/* Add Wallet */}
                <div className="min-w-[100px] snap-center bg-transparent border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center h-[180px] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-black">add</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-3 font-medium group-hover:text-primary">{t('common.addNew')}</p>
                </div>
            </div>
        </div>
    );
};

export default WalletsSection;
