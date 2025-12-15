import React from 'react';
import { Link } from 'react-router-dom';
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

const TransactionsSection = () => {
    const { transactions, loading } = useData();

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Transactions</h3>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
                    <div className="animate-pulse p-4 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-24"></div>
                                </div>
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show empty state if no transactions
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Transactions</h3>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none p-8 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-white/20 mb-4">receipt_long</span>
                    <p className="text-slate-500 dark:text-slate-400">No transactions yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add your first transaction to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Transactions</h3>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={async () => {
                            if (transactions.length === 0) {
                                alert('No transactions to export');
                                return;
                            }
                            try {
                                const allTx = await transactionsAPI.getAll({});
                                const headers = ['Date', 'Type', 'Category', 'Description', 'Wallet', 'Amount'];
                                const rows = allTx.map(tx => [
                                    formatDate(tx.transactionDate),
                                    tx.type,
                                    tx.categoryName || '-',
                                    (tx.description || '-').replace(/;/g, ','),
                                    tx.walletName || '-',
                                    tx.type === 'expense' ? -parseFloat(tx.amount) : parseFloat(tx.amount),
                                ]);
                                // Use semicolon as separator for Excel compatibility
                                const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(row => row.join(';'))].join('\r\n');
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.setAttribute('href', url);
                                link.setAttribute('download', `saifu-transactions-${new Date().toISOString().split('T')[0]}.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } catch (err) {
                                alert('Failed to export CSV');
                            }
                        }}
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                    <Link to="/history" className="text-primary text-sm font-medium hover:underline">View All</Link>
                </div>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Transaction</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: tx.categoryColor ? `${tx.categoryColor}20` : '#6b728020' }}
                                        >
                                            <span
                                                className="material-symbols-outlined text-lg"
                                                style={{ color: tx.categoryColor || '#6b7280' }}
                                            >
                                                {tx.categoryIcon || 'receipt'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium text-sm">{tx.description || tx.categoryName || 'Transaction'}</p>
                                            <p className="text-slate-500 text-xs">{tx.walletName || 'Wallet'}</p>
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
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                                    {formatDate(tx.transactionDate)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-medium text-sm ${tx.type === 'income' ? 'text-primary font-bold' : 'text-slate-900 dark:text-white'}`}>
                                        {formatCurrency(parseFloat(tx.amount), tx.type)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsSection;
