import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

// Available icons for categories
const iconOptions = [
    'restaurant', 'commute', 'shopping_bag', 'movie', 'bolt', 'medical_services',
    'school', 'home', 'subscriptions', 'more_horiz', 'payments', 'work',
    'trending_up', 'redeem', 'receipt_long', 'add_circle', 'sports_esports',
    'fitness_center', 'pets', 'child_care', 'local_cafe', 'local_bar',
    'flight', 'beach_access', 'spa', 'checkroom', 'devices', 'build',
    'savings', 'account_balance', 'attach_money', 'card_giftcard', 'store'
];

// Color palette
const colorOptions = [
    '#f97316', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308', '#22c55e',
    '#06b6d4', '#64748b', '#e50914', '#6b7280', '#13ecb6', '#10b981',
    '#22d3ee', '#f472b6', '#a3e635', '#94a3b8', '#ef4444', '#14b8a6'
];

const Categories = ({ onMenuClick }) => {
    const { categories, addCategory, refreshAll, userId } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('expense');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        icon: 'category',
        type: 'expense',
        color: '#6b7280',
    });

    const resetForm = () => {
        setFormData({
            name: '',
            icon: 'category',
            type: activeTab,
            color: '#6b7280',
        });
        setEditingCategory(null);
        setError('');
    };

    const openAddModal = () => {
        resetForm();
        setFormData(prev => ({ ...prev, type: activeTab }));
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            icon: category.icon || 'category',
            type: category.type,
            color: category.color || '#6b7280',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory.id, formData);
                toast.success('Category updated successfully!');
            } else {
                await addCategory(formData);
                toast.success('Category created successfully!');
            }
            await refreshAll();
            setShowModal(false);
            resetForm();
        } catch (err) {
            toast.error(err.message || 'Failed to save category');
            setError(err.message || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (categoryId) => {
        setDeletingId(categoryId);
        try {
            await categoriesAPI.delete(categoryId);
            await refreshAll();
            toast.success('Category deleted successfully!');
            setShowDeleteConfirm(null);
        } catch (err) {
            toast.error(err.message || 'Failed to delete category');
        } finally {
            setDeletingId(null);
        }
    };

    // Filter categories by type and ownership
    const filteredCategories = categories.filter(cat => cat.type === activeTab);
    const userCategories = filteredCategories.filter(cat => cat.userId === userId);
    const defaultCategories = filteredCategories.filter(cat => !cat.userId || cat.isDefault === 'true');

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />

            <div className="p-8 flex flex-col gap-6 max-w-[1200px]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categories</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your income and expense categories</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 rounded-xl bg-primary text-[#10221d] font-bold hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Category
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-1.5 inline-flex border border-slate-200 dark:border-white/5 w-fit">
                    <button
                        onClick={() => setActiveTab('expense')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm mr-2 align-middle">arrow_upward</span>
                        Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'income'
                            ? 'bg-primary text-[#10221d]'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm mr-2 align-middle">arrow_downward</span>
                        Income
                    </button>
                </div>

                {/* User Categories */}
                {userCategories.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {userCategories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 group hover:border-primary/50 transition-all relative"
                                >
                                    <div
                                        className="h-12 w-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${cat.color}20` }}
                                    >
                                        <span className="material-symbols-outlined text-2xl" style={{ color: cat.color }}>
                                            {cat.icon || 'category'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-900 dark:text-white font-medium truncate">{cat.name}</p>
                                        <p className="text-slate-400 text-xs">Custom</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(cat)}
                                            className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary hover:text-black flex items-center justify-center transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(cat.id)}
                                            disabled={deletingId === cat.id}
                                            className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === cat.id ? (
                                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Default Categories */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Default Categories
                        <span className="text-sm font-normal text-slate-400 ml-2">(Read-only)</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {defaultCategories.map(cat => (
                            <div
                                key={cat.id}
                                className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 opacity-80"
                            >
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${cat.color}20` }}
                                >
                                    <span className="material-symbols-outlined text-2xl" style={{ color: cat.color }}>
                                        {cat.icon || 'category'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-900 dark:text-white font-medium truncate">{cat.name}</p>
                                    <p className="text-slate-400 text-xs">Default</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-white/5 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Category Name */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Groceries"
                                    className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary p-4 font-medium placeholder-slate-400"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${formData.type === 'expense'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-slate-100 dark:bg-surface-dark text-slate-500'
                                            }`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${formData.type === 'income'
                                            ? 'bg-primary text-[#10221d]'
                                            : 'bg-slate-100 dark:bg-surface-dark text-slate-500'
                                            }`}
                                    >
                                        Income
                                    </button>
                                </div>
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Icon</label>
                                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto bg-slate-50 dark:bg-surface-dark p-3 rounded-xl">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                            className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${formData.icon === icon
                                                ? 'bg-primary text-black ring-2 ring-primary'
                                                : 'bg-white dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                            className={`h-8 w-8 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-card-dark scale-110' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="p-4 bg-slate-50 dark:bg-surface-dark rounded-xl">
                                <p className="text-xs text-slate-400 mb-2">Preview</p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-12 w-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${formData.color}20` }}
                                    >
                                        <span className="material-symbols-outlined text-2xl" style={{ color: formData.color }}>
                                            {formData.icon}
                                        </span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-medium">{formData.name || 'Category Name'}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
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
                                    className="flex-1 px-6 py-4 rounded-xl bg-primary text-[#10221d] font-bold hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Saving...
                                        </>
                                    ) : (
                                        editingCategory ? 'Save Changes' : 'Add Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 w-full max-w-sm p-6 text-center">
                        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Category?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={deletingId}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={deletingId}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deletingId ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Categories;
