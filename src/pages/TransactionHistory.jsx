import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { transactionsAPI } from '../services/api';

// Format number to Indonesian Rupiah
const formatCurrency = (amount, type) => {
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    return prefix + new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(amount)).replace('IDR', 'Rp');
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Edit Transaction Modal Component
const EditTransactionModal = ({ transaction, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        description: transaction.description || '',
        categoryId: transaction.categoryId || '',
        transactionDate: transaction.transactionDate?.split('T')[0] || '',
        note: transaction.note || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(transaction.id, formData);
            onClose();
        } catch (err) {
            alert(err.message || 'Failed to update transaction');
        } finally {
            setSaving(false);
        }
    };

    // Filter categories by transaction type
    const filteredCategories = categories.filter(c => c.type === transaction.type);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card-dark rounded-2xl w-full max-w-md border border-slate-200 dark:border-white/10 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Transaction</h3>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-500 dark:text-white/50">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="p-5 space-y-4">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-primary"
                            placeholder="Transaction description"
                        />
                    </div>

                    {/* Category */}
                    {transaction.type !== 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select category</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.transactionDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Note
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-primary resize-none"
                            rows={3}
                            placeholder="Additional notes..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200 dark:border-white/5">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-primary text-[#10221d] font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">check</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TransactionHistory = ({ onMenuClick }) => {
    const { wallets, categories, deleteTransaction, updateTransaction, refreshAll } = useData();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filter, setFilter] = useState({
        type: 'all',
        walletId: 'all',
        categoryId: 'all',
        startDate: '',
        endDate: '',
    });

    // Fetch all transactions
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (filter.type !== 'all') filters.type = filter.type;
            if (filter.walletId !== 'all') filters.walletId = filter.walletId;
            if (filter.categoryId !== 'all') filters.categoryId = filter.categoryId;
            if (filter.startDate) filters.startDate = filter.startDate;
            if (filter.endDate) filters.endDate = filter.endDate;

            const data = await transactionsAPI.getAll(filters);
            setTransactions(data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    // Handle delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete transaction');
        }
    };

    // Handle edit save
    const handleEditSave = async (id, data) => {
        await updateTransaction(id, data);
        // Refresh transactions to get updated data with category names
        await fetchTransactions();
    };

    // Export to CSV
    const exportToCSV = () => {
        if (transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

        const headers = ['Date', 'Type', 'Category', 'Description', 'Wallet', 'Amount'];
        const rows = transactions.map(tx => [
            formatDate(tx.transactionDate),
            tx.type,
            tx.categoryName || '-',
            (tx.description || '-').replace(/;/g, ','),
            tx.walletName || '-',
            tx.type === 'expense' ? -parseFloat(tx.amount) : parseFloat(tx.amount),
        ]);

        // Calculate monthly totals
        const monthlyTotals = transactions.reduce((acc, tx) => {
            const date = new Date(tx.transactionDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            if (!acc[monthKey]) {
                acc[monthKey] = { label: monthLabel, income: 0, expense: 0 };
            }

            const amount = parseFloat(tx.amount);
            if (tx.type === 'income') {
                acc[monthKey].income += amount;
            } else if (tx.type === 'expense') {
                acc[monthKey].expense += amount;
            }
            return acc;
        }, {});

        // Sort months and create summary rows
        const sortedMonths = Object.keys(monthlyTotals).sort().reverse();
        const summaryRows = [
            ['', '', '', '', '', ''],
            ['MONTHLY SUMMARY', '', '', '', '', ''],
            ['Month', 'Income', 'Expense', 'Net', '', ''],
            ...sortedMonths.map(key => {
                const m = monthlyTotals[key];
                return [m.label, m.income, -m.expense, m.income - m.expense, '', ''];
            }),
            ['', '', '', '', '', ''],
            ['GRAND TOTAL', totals.income, -totals.expense, totals.income - totals.expense, '', '']
        ];

        // Use semicolon as separator and add BOM for Excel compatibility
        const csvContent = '\uFEFF' + [
            headers.join(';'),
            ...rows.map(row => row.join(';')),
            ...summaryRows.map(row => row.join(';'))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `saifu-transactions-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate totals
    const totals = transactions.reduce((acc, tx) => {
        const amount = parseFloat(tx.amount);
        if (tx.type === 'income') acc.income += amount;
        if (tx.type === 'expense') acc.expense += amount;
        return acc;
    }, { income: 0, expense: 0 });

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />

            <div className="p-4 md:p-8 flex flex-col gap-6 max-w-[1400px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Transaction History</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {transactions.length} transactions found
                        </p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5">
                        <p className="text-slate-500 text-sm">Total Income</p>
                        <p className="text-primary text-xl font-bold mt-1">{formatCurrency(totals.income, 'income')}</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5">
                        <p className="text-slate-500 text-sm">Total Expenses</p>
                        <p className="text-red-500 text-xl font-bold mt-1">{formatCurrency(totals.expense, 'expense')}</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5 col-span-2 md:col-span-1">
                        <p className="text-slate-500 text-sm">Net</p>
                        <p className={`text-xl font-bold mt-1 ${totals.income - totals.expense >= 0 ? 'text-primary' : 'text-red-500'}`}>
                            {formatCurrency(totals.income - totals.expense, totals.income - totals.expense >= 0 ? 'income' : 'expense')}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                            className="bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-lg border-none p-3 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="transfer">Transfer</option>
                        </select>

                        <select
                            value={filter.walletId}
                            onChange={(e) => setFilter(prev => ({ ...prev, walletId: e.target.value }))}
                            className="bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-lg border-none p-3 text-sm"
                        >
                            <option value="all">All Wallets</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>

                        <select
                            value={filter.categoryId}
                            onChange={(e) => setFilter(prev => ({ ...prev, categoryId: e.target.value }))}
                            className="bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-lg border-none p-3 text-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                            placeholder="Start Date"
                            className="bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-lg border-none p-3 text-sm"
                        />

                        <input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
                            placeholder="End Date"
                            className="bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-lg border-none p-3 text-sm"
                        />
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-white/20 animate-spin">progress_activity</span>
                            <p className="text-slate-500 mt-2">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-white/20">receipt_long</span>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">No transactions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Transaction</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: tx.categoryColor ? `${tx.categoryColor}20` : '#6b728020' }}
                                                    >
                                                        <span
                                                            className="material-symbols-outlined text-lg"
                                                            style={{ color: tx.categoryColor || '#6b7280' }}
                                                        >
                                                            {tx.categoryIcon || 'receipt'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-slate-900 dark:text-white font-medium text-sm truncate">
                                                            {tx.description || tx.categoryName || 'Transaction'}
                                                        </p>
                                                        <p className="text-slate-500 text-xs truncate">{tx.walletName || 'Wallet'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                                                    style={{
                                                        backgroundColor: tx.type === 'income' ? 'rgba(19, 236, 182, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                                        color: tx.type === 'income' ? '#13ecb6' : '#64748b',
                                                        borderColor: tx.type === 'income' ? 'rgba(19, 236, 182, 0.2)' : 'rgba(100, 116, 139, 0.2)'
                                                    }}
                                                >
                                                    {tx.categoryName || tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                                                {formatDate(tx.transactionDate)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`font-medium text-sm ${tx.type === 'income' ? 'text-primary font-bold' : 'text-slate-900 dark:text-white'}`}>
                                                    {formatCurrency(parseFloat(tx.amount), tx.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => setEditingTransaction(tx)}
                                                        className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tx.id)}
                                                        className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    categories={categories}
                    onClose={() => setEditingTransaction(null)}
                    onSave={handleEditSave}
                />
            )}
        </main>
    );
};

export default TransactionHistory;

