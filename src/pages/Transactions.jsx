import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { ArrowUpRight, ArrowDown, ArrowRightLeft, Menu, X, Calendar, Check, Loader2 } from 'lucide-react';
import { getIcon } from '../lib/iconMap';

// Format number to Indonesian Rupiah for display
const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
};

// Format number with thousand separators for input display
const formatInputAmount = (value) => {
    if (!value) return '';
    // Remove non-digits
    const numericValue = value.toString().replace(/\D/g, '');
    // Format with dots as thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted input back to number
const parseInputAmount = (value) => {
    if (!value) return '';
    // Remove all dots and return as number string
    return value.replace(/\./g, '');
};

const Transactions = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { wallets, categories, addTransaction, loading } = useData();

    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [displayAmount, setDisplayAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [selectedToWallet, setSelectedToWallet] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Handle amount input change
    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const rawValue = parseInputAmount(inputValue);
        setAmount(rawValue);
        setDisplayAmount(formatInputAmount(rawValue));
    };

    // Filter categories based on transaction type
    const filteredCategories = categories.filter(cat => {
        if (transactionType === 'transfer') return false;
        return cat.type === transactionType;
    });

    // Handle form submission
    const handleSubmit = async () => {
        setError('');

        // Validation
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!selectedWallet) {
            setError('Please select a wallet');
            return;
        }
        if (transactionType === 'transfer' && !selectedToWallet) {
            setError('Please select a destination wallet for transfer');
            return;
        }
        if (transactionType !== 'transfer' && !selectedCategory) {
            setError('Please select a category');
            return;
        }

        setIsSubmitting(true);
        try {
            await addTransaction({
                walletId: selectedWallet,
                toWalletId: transactionType === 'transfer' ? selectedToWallet : null,
                categoryId: transactionType !== 'transfer' ? selectedCategory : null,
                type: transactionType,
                amount: parseFloat(amount),
                description: description || null,
                note: note || null,
                transactionDate,
            });

            toast.success('Transaction added successfully!');
            // Reset form and navigate back
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Failed to add transaction');
            setError(err.message || 'Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Set default wallet when wallets load
    React.useEffect(() => {
        if (wallets.length > 0 && !selectedWallet) {
            setSelectedWallet(wallets[0].id);
        }
    }, [wallets, selectedWallet]);


    // Reset category when transaction type changes
    React.useEffect(() => {
        setSelectedCategory('');
    }, [transactionType]);

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-y-auto hide-scroll">
            {/* Header */}
            <header className="w-full px-4 md:px-8 py-6 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Add Transaction</h2>
                        <p className="text-slate-500 dark:text-[#9db9b2] text-sm mt-1">Record a new expense, income, or transfer.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    aria-label="Close"
                    className="size-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-[#283935] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            {/* Error Message */}
            {error && (
                <div className="mx-4 md:mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                    {error}
                </div>
            )}

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
                                    <ArrowUpRight className="w-[18px] h-[18px]" />
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
                                    <ArrowDown className="w-[18px] h-[18px]" />
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
                                    <ArrowRightLeft className="w-[18px] h-[18px]" />
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
                                    <span className="text-3xl md:text-4xl text-slate-400 dark:text-[#5e7c74] absolute left-4 lg:left-8 font-light">Rp</span>
                                    <input
                                        autoFocus
                                        className="w-full bg-transparent border-none text-center text-3xl md:text-5xl font-black text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-[#283935] focus:ring-0 p-0 caret-primary"
                                        id="amount"
                                        placeholder="0"
                                        type="text"
                                        inputMode="numeric"
                                        value={displayAmount}
                                        onChange={handleAmountChange}
                                    />
                                </div>
                            </div>

                            {/* Wallet Source */}
                            <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2]">
                                        {transactionType === 'transfer' ? 'From Wallet' : 'Pay with'}
                                    </label>
                                </div>
                                <div className="space-y-3">
                                    {loading ? (
                                        <div className="animate-pulse space-y-3">
                                            {[1, 2].map(i => (
                                                <div key={i} className="h-16 bg-slate-100 dark:bg-[#1c2724] rounded-2xl"></div>
                                            ))}
                                        </div>
                                    ) : wallets.length === 0 ? (
                                        <p className="text-slate-400 text-sm text-center py-4">No wallets found. Create one first.</p>
                                    ) : (
                                        wallets.map(wallet => {
                                            const Icon = getIcon(wallet.icon || 'account_balance');
                                            return (
                                                <label
                                                    key={wallet.id}
                                                    className={`flex items-center gap-4 p-3 rounded-2xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1c2724] transition-all ${selectedWallet === wallet.id
                                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                        : 'border-slate-200 dark:border-[#283935]'
                                                        }`}
                                                >
                                                    <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-900 dark:text-white">{wallet.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-[#9db9b2]">{formatCurrency(parseFloat(wallet.balance))}</p>
                                                    </div>
                                                    <input
                                                        className="text-primary focus:ring-primary border-gray-300 dark:border-gray-600 bg-transparent size-5"
                                                        name="wallet"
                                                        type="radio"
                                                        checked={selectedWallet === wallet.id}
                                                        onChange={() => setSelectedWallet(wallet.id)}
                                                    />
                                                </label>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* To Wallet (for transfers) */}
                            {transactionType === 'transfer' && (
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-4 block">To Wallet</label>
                                    <div className="space-y-3">
                                        {wallets.filter(w => w.id !== selectedWallet).map(wallet => {
                                            const Icon = getIcon(wallet.icon || 'account_balance');
                                            return (
                                                <label
                                                    key={wallet.id}
                                                    className={`flex items-center gap-4 p-3 rounded-2xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1c2724] transition-all ${selectedToWallet === wallet.id
                                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                        : 'border-slate-200 dark:border-[#283935]'
                                                        }`}
                                                >
                                                    <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-900 dark:text-white">{wallet.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-[#9db9b2]">{formatCurrency(parseFloat(wallet.balance))}</p>
                                                    </div>
                                                    <input
                                                        className="text-primary focus:ring-primary border-gray-300 dark:border-gray-600 bg-transparent size-5"
                                                        name="to_wallet"
                                                        type="radio"
                                                        checked={selectedToWallet === wallet.id}
                                                        onChange={() => setSelectedToWallet(wallet.id)}
                                                    />
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Category Selection (not for transfers) */}
                            {transactionType !== 'transfer' && (
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2]">Category</label>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {filteredCategories.map((cat) => {
                                            const Icon = getIcon(cat.icon || 'category');
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border focus:outline-none active:scale-95 transition-all group ${selectedCategory === cat.id
                                                        ? 'ring-2 ring-primary bg-primary/10 dark:bg-primary/10 border-transparent'
                                                        : 'bg-slate-100 dark:bg-[#1c2724] hover:bg-slate-200 dark:hover:bg-[#283935] border-transparent'
                                                        }`}
                                                >
                                                    <div style={{ color: selectedCategory === cat.id ? '#13ecb6' : (cat.color || '#9db9b2') }}>
                                                        <Icon className="w-7 h-7" />
                                                    </div>
                                                    <span className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#9db9b2]'}`}>
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block" htmlFor="description">
                                    Description <span className="text-xs font-normal opacity-50">(Optional)</span>
                                </label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 h-14 font-medium placeholder-slate-400 dark:placeholder-[#5e7c74]"
                                    id="description"
                                    placeholder="e.g., Lunch at restaurant"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Date & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date Picker */}
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block">Date</label>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 h-14 font-medium appearance-none"
                                            type="date"
                                            value={transactionDate}
                                            onChange={(e) => setTransactionDate(e.target.value)}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-[#9db9b2]">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Note */}
                                <div className="bg-white dark:bg-[#182a25] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-3 block" htmlFor="notes">
                                        Note <span className="text-xs font-normal opacity-50">(Optional)</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 resize-none placeholder-slate-400 dark:placeholder-[#5e7c74]"
                                        id="notes"
                                        placeholder="Any additional notes..."
                                        rows="2"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-gray-200 dark:border-white/5">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 rounded-xl text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-200 dark:hover:bg-[#283935] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-4 rounded-xl bg-primary text-[#10221d] font-bold text-lg hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Add Transaction
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Transactions;
