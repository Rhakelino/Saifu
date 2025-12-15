import React, { useState } from 'react';

const Transactions = ({ onMenuClick }) => {
    const [transactionType, setTransactionType] = useState('expense');

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-y-auto hide-scroll">
            {/* Header */}
            <header className="w-full px-4 md:px-8 py-6 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Add Transaction</h2>
                        <p className="text-slate-500 dark:text-[#9db9b2] text-sm mt-1">Record a new expense, income, or transfer.</p>
                    </div>
                </div>
                <button aria-label="Close" className="size-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-[#283935] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-200">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            {/* Form Container */}
            <div className="flex-1 p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-5xl flex flex-col gap-8">
                    {/* Transaction Type Toggle */}
                    <div className="flex justify-center overflow-x-auto">
                        <div className="bg-white dark:bg-[#182a25] p-1.5 rounded-2xl inline-flex shadow-sm border border-gray-100 dark:border-white/5 min-w-fit">
                            <label className="relative cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="transaction_type"
                                    type="radio"
                                    value="expense"
                                    checked={transactionType === 'expense'}
                                    onChange={() => setTransactionType('expense')}
                                />
                                <div className="px-6 md:px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-[#9db9b2] peer-checked:bg-slate-900 peer-checked:text-white dark:peer-checked:bg-primary dark:peer-checked:text-[#10221d] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                                    Expense
                                </div>
                            </label>
                            <label className="relative cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="transaction_type"
                                    type="radio"
                                    value="income"
                                    checked={transactionType === 'income'}
                                    onChange={() => setTransactionType('income')}
                                />
                                <div className="px-6 md:px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-[#9db9b2] peer-checked:bg-slate-900 peer-checked:text-white dark:peer-checked:bg-primary dark:peer-checked:text-[#10221d] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                                    Income
                                </div>
                            </label>
                            <label className="relative cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="transaction_type"
                                    type="radio"
                                    value="transfer"
                                    checked={transactionType === 'transfer'}
                                    onChange={() => setTransactionType('transfer')}
                                />
                                <div className="px-6 md:px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-[#9db9b2] peer-checked:bg-slate-900 peer-checked:text-white dark:peer-checked:bg-primary dark:peer-checked:text-[#10221d] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                                    Transfer
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Amount & Source */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* Amount Input */}
                            <div className="bg-white dark:bg-[#182a25] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-4 text-center group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-[#5e7c74]" htmlFor="amount">Enter Amount</label>
                                <div className="relative w-full flex items-center justify-center">
                                    <span className="text-4xl text-slate-400 dark:text-[#5e7c74] absolute left-4 lg:left-8 font-light">Rp</span>
                                    <input autoFocus className="w-full bg-transparent border-none text-center text-4xl md:text-6xl font-black text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-[#283935] focus:ring-0 p-0 caret-primary" id="amount" placeholder="0" type="number" />
                                </div>
                            </div>
                            {/* Wallet Source */}
                            <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2]">Pay with</label>
                                    <button className="text-primary text-xs font-bold hover:underline">Add New +</button>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200 dark:border-[#283935] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1c2724] has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:dark:bg-primary/10 transition-all">
                                        <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                            <span className="material-symbols-outlined">credit_card</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white">Chase Sapphire</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9db9b2]">•••• 4242</p>
                                        </div>
                                        <input defaultChecked className="text-primary focus:ring-primary border-gray-300 dark:border-gray-600 bg-transparent size-5" name="wallet" type="radio" value="card" />
                                    </label>
                                    <label className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200 dark:border-[#283935] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1c2724] has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:dark:bg-primary/10 transition-all">
                                        <div className="size-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white">Cash</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9db9b2]">Balance: Rp 1.800.000</p>
                                        </div>
                                        <input className="text-primary focus:ring-primary border-gray-300 dark:border-gray-600 bg-transparent size-5" name="wallet" type="radio" value="cash" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Category Selection */}
                            <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2]">Category</label>
                                    <button className="text-xs font-medium text-slate-400 dark:text-[#5e7c74] hover:text-white flex items-center gap-1">
                                        View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {/* Category Item: Active */}
                                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#1c2724] hover:bg-slate-200 dark:hover:bg-[#283935] border border-transparent focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 transition-all group selected ring-2 ring-primary bg-primary/10 dark:bg-primary/10">
                                        <div className="text-primary">
                                            <span className="material-symbols-outlined text-[28px]">restaurant</span>
                                        </div>
                                        <span className="text-xs font-medium text-slate-900 dark:text-white">Food</span>
                                    </button>
                                    {/* Category Items: Default */}
                                    {[
                                        { icon: 'commute', label: 'Transport' },
                                        { icon: 'shopping_bag', label: 'Shopping' },
                                        { icon: 'home', label: 'Rent' },
                                        { icon: 'movie', label: 'Entertainment' },
                                        { icon: 'medical_services', label: 'Health' },
                                        { icon: 'school', label: 'Education' },
                                        { icon: 'more_horiz', label: 'More' }
                                    ].map((cat, index) => (
                                        <button key={index} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#1c2724] hover:bg-slate-200 dark:hover:bg-[#283935] border border-transparent focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 transition-all group">
                                            <div className="text-slate-500 dark:text-[#9db9b2] group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-[#9db9b2] group-hover:text-slate-900 dark:group-hover:text-white">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date Picker */}
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block">Date</label>
                                    <div className="relative">
                                        <input className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 h-14 font-medium appearance-none" type="date" defaultValue="2023-10-27" />
                                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-[#9db9b2]">
                                            <span className="material-symbols-outlined">calendar_today</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Attachments */}
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block">Attachments</label>
                                    <button className="flex items-center justify-center gap-2 w-full h-14 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#283935] text-slate-400 dark:text-[#5e7c74] hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                                        <span className="material-symbols-outlined">attach_file</span>
                                        <span className="text-sm font-medium">Add Receipt</span>
                                    </button>
                                </div>
                            </div>
                            {/* Note Textarea */}
                            <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm flex-1">
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block" htmlFor="notes">Note <span className="text-xs font-normal opacity-50">(Optional)</span></label>
                                <textarea className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 resize-none placeholder-slate-400 dark:placeholder-[#5e7c74]" id="notes" placeholder="What is this for?" rows="3"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-gray-200 dark:border-white/5">
                        <button className="px-8 py-4 rounded-xl text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-200 dark:hover:bg-[#283935] transition-colors">
                            Cancel
                        </button>
                        <button className="px-10 py-4 rounded-xl bg-primary text-[#10221d] font-bold text-lg hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">check</span>
                            Add Transaction
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Transactions;
