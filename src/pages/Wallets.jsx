import React, { useState } from 'react';
import Header from '../components/Header';
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

// Format number with thousand separators for input display
const formatInputAmount = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted input back to number
const parseInputAmount = (value) => {
    if (!value) return '';
    return value.replace(/\./g, '');
};

const walletTypes = [
    { value: 'bank', label: 'Bank Account', icon: 'account_balance' },
    { value: 'cash', label: 'Cash', icon: 'payments' },
    { value: 'credit_card', label: 'Credit Card', icon: 'credit_card' },
    { value: 'e_wallet', label: 'E-Wallet', icon: 'wallet' },
    { value: 'crypto', label: 'Crypto', icon: 'currency_bitcoin' },
    { value: 'other', label: 'Other', icon: 'account_balance_wallet' },
];

const walletColors = [
    '#1e1e1e', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#13ecb6'
];

const Wallets = ({ onMenuClick }) => {
    const { wallets, addWallet, updateWallet, deleteWallet, loading } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'bank',
        balance: '',
        icon: 'account_balance',
        accountNumber: '',
        color: '#1e1e1e',
    });
    const [displayBalance, setDisplayBalance] = useState('');

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'bank',
            balance: '',
            icon: 'account_balance',
            accountNumber: '',
            color: '#1e1e1e',
        });
        setDisplayBalance('');
        setEditingWallet(null);
        setError('');
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (wallet) => {
        setEditingWallet(wallet);
        setFormData({
            name: wallet.name,
            type: wallet.type,
            balance: wallet.balance || '',
            icon: wallet.icon || 'account_balance',
            accountNumber: wallet.accountNumber || '',
            color: wallet.color || '#1e1e1e',
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBalanceChange = (e) => {
        const inputValue = e.target.value;
        const rawValue = parseInputAmount(inputValue);
        setFormData(prev => ({ ...prev, balance: rawValue }));
        setDisplayBalance(formatInputAmount(rawValue));
    };

    const handleTypeChange = (type) => {
        const typeData = walletTypes.find(t => t.value === type);
        setFormData(prev => ({
            ...prev,
            type,
            icon: typeData?.icon || 'account_balance'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Wallet name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const walletData = {
                name: formData.name,
                type: formData.type,
                icon: formData.icon,
                accountNumber: formData.accountNumber || null,
                color: formData.color,
            };

            if (editingWallet) {
                // Update existing wallet
                await updateWallet(editingWallet.id, walletData);
            } else {
                // Create new wallet with balance
                await addWallet({
                    ...walletData,
                    balance: formData.balance || '0',
                });
            }

            resetForm();
            setShowModal(false);
        } catch (err) {
            setError(err.message || 'Failed to save wallet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (walletId) => {
        if (!confirm('Are you sure you want to delete this wallet? All transactions will also be deleted.')) {
            return;
        }

        try {
            await deleteWallet(walletId);
        } catch (err) {
            alert(err.message || 'Failed to delete wallet');
        }
    };

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[1600px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wallets</h1>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 rounded-xl bg-primary text-[#10221d] font-bold hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Wallet
                    </button>
                </div>

                {/* Wallets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-200 dark:bg-card-dark rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : wallets.length === 0 ? (
                    <div className="bg-white dark:bg-card-dark p-12 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-white/20 mb-4">account_balance_wallet</span>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No wallets yet</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Create your first wallet to start tracking your finances</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wallets.map(wallet => {
                            const typeData = walletTypes.find(t => t.value === wallet.type) || walletTypes[5];

                            return (
                                <div
                                    key={wallet.id}
                                    className="bg-gradient-to-br from-[#1e1e1e] to-[#121212] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-all"
                                    style={{ background: `linear-gradient(135deg, ${wallet.color || '#1e1e1e'}, ${wallet.color || '#1e1e1e'}cc)` }}
                                >
                                    {/* Action buttons */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-2 transition-all z-20">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditModal(wallet); }}
                                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-primary text-white hover:text-black flex items-center justify-center transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(wallet.id); }}
                                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>

                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-6xl text-white">{wallet.icon || typeData.icon}</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                                                <span className="material-symbols-outlined text-white">{wallet.icon || typeData.icon}</span>
                                            </div>
                                            {wallet.accountNumber && (
                                                <p className="text-white/60 text-sm font-medium tracking-wider">**** {wallet.accountNumber.slice(-4)}</p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-white/60 text-sm font-medium mb-1">{wallet.name}</p>
                                            <p className="text-white text-2xl font-bold tracking-wider">
                                                {formatCurrency(parseFloat(wallet.balance))}
                                            </p>
                                            <p className="text-white/40 text-xs mt-2">{typeData.label}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New Wallet Card */}
                        <button
                            onClick={openAddModal}
                            className="min-h-[200px] bg-transparent border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-black">add</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-3 font-medium group-hover:text-primary">Add New Wallet</p>
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Wallet Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-white/5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
                            </h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Wallet Name */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-2 block">Wallet Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Main Bank Account"
                                    className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 font-medium placeholder-slate-400 dark:placeholder-[#5e7c74]"
                                />
                            </div>

                            {/* Wallet Type */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-2 block">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {walletTypes.map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handleTypeChange(type.value)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.type === type.value
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                                : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1c2724] hover:bg-slate-100 dark:hover:bg-[#283935]'
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined ${formData.type === type.value ? 'text-primary' : 'text-slate-400'}`}>
                                                {type.icon}
                                            </span>
                                            <span className={`text-xs font-medium ${formData.type === type.value ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Initial Balance (only for new wallets) */}
                            {!editingWallet && (
                                <div>
                                    <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-2 block">Initial Balance</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="balance"
                                            value={displayBalance}
                                            onChange={handleBalanceChange}
                                            placeholder="0"
                                            className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 pl-12 font-medium placeholder-slate-400 dark:placeholder-[#5e7c74]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Account Number (optional) */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-2 block">
                                    Account Number <span className="text-xs font-normal opacity-50">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1234567890"
                                    className="w-full bg-slate-50 dark:bg-[#1c2724] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 font-medium placeholder-slate-400 dark:placeholder-[#5e7c74]"
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-[#9db9b2] mb-2 block">Card Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {walletColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                            className={`h-10 w-10 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-card-dark scale-110' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="flex-1 px-6 py-4 rounded-xl text-slate-600 dark:text-gray-300 font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 rounded-xl bg-primary text-[#10221d] font-bold hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            {editingWallet ? 'Saving...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">{editingWallet ? 'save' : 'add'}</span>
                                            {editingWallet ? 'Save Changes' : 'Create Wallet'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Wallets;
