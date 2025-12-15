import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletsAPI, categoriesAPI, transactionsAPI, statsAPI, setCurrentUserId, getCurrentUserId } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export function DataProvider({ children }) {
    const { user, isAuthenticated } = useAuth();

    // State
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set user ID when user changes
    useEffect(() => {
        if (user?.id) {
            setCurrentUserId(user.id);
        }
    }, [user]);

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [walletsData, categoriesData, transactionsData, statsData] = await Promise.all([
                walletsAPI.getAll(user.id),
                categoriesAPI.getAll(user.id),
                transactionsAPI.getAll({ limit: 10 }),
                statsAPI.getDashboard(),
            ]);

            setWallets(walletsData);
            setCategories(categoriesData);
            setTransactions(transactionsData);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch data when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchAllData();
        }
    }, [isAuthenticated, user, fetchAllData]);

    // Wallet operations
    const addWallet = async (data) => {
        const newWallet = await walletsAPI.create(data);
        setWallets(prev => [...prev, newWallet]);
        return newWallet;
    };

    const updateWallet = async (id, data) => {
        const updated = await walletsAPI.update(id, data);
        setWallets(prev => prev.map(w => w.id === id ? updated : w));
        return updated;
    };

    const deleteWallet = async (id) => {
        await walletsAPI.delete(id);
        setWallets(prev => prev.filter(w => w.id !== id));
    };

    // Transaction operations
    const addTransaction = async (data) => {
        const newTransaction = await transactionsAPI.create(data);
        setTransactions(prev => [newTransaction, ...prev]);
        // Refresh stats and wallets after adding transaction
        const [statsData, walletsData] = await Promise.all([
            statsAPI.getDashboard(),
            walletsAPI.getAll(user?.id),
        ]);
        setStats(statsData);
        setWallets(walletsData);
        return newTransaction;
    };

    const deleteTransaction = async (id) => {
        await transactionsAPI.delete(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
        // Refresh stats and wallets after deleting transaction
        const [statsData, walletsData] = await Promise.all([
            statsAPI.getDashboard(),
            walletsAPI.getAll(user?.id),
        ]);
        setStats(statsData);
        setWallets(walletsData);
    };

    const updateTransaction = async (id, data) => {
        const updated = await transactionsAPI.update(id, data);
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
        // Refresh stats in case category changed
        const statsData = await statsAPI.getDashboard();
        setStats(statsData);
        return updated;
    };

    // Category operations
    const addCategory = async (data) => {
        const newCategory = await categoriesAPI.create(data);
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    };

    const updateCategory = async (id, data) => {
        const updated = await categoriesAPI.update(id, data);
        setCategories(prev => prev.map(c => c.id === id ? updated : c));
        return updated;
    };

    const deleteCategory = async (id) => {
        await categoriesAPI.delete(id);
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const refreshCategories = async () => {
        const data = await categoriesAPI.getAll(user?.id);
        setCategories(data);
        return data;
    };

    // Refresh functions
    const refreshWallets = async () => {
        const data = await walletsAPI.getAll(user?.id);
        setWallets(data);
        return data;
    };

    const refreshTransactions = async (filters = {}) => {
        const data = await transactionsAPI.getAll(filters);
        setTransactions(data);
        return data;
    };

    const refreshStats = async () => {
        const data = await statsAPI.getDashboard();
        setStats(data);
        return data;
    };

    const value = {
        // Data
        wallets,
        categories,
        transactions,
        stats,
        loading,
        error,
        userId: user?.id,

        // Operations
        addWallet,
        updateWallet,
        deleteWallet,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,

        // Refresh
        refreshWallets,
        refreshTransactions,
        refreshStats,
        refreshCategories,
        refreshAll: fetchAllData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
