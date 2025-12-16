import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, ChevronDown, LogOut } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    // Get current date formatted
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        {dateStr}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                    </p>
                    <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Dashboard</h2>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex bg-slate-100 dark:bg-card-dark rounded-lg p-1 border border-slate-200 dark:border-white/5">
                    <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm">This Month</button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Last Month</button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">YTD</button>
                </div>
                <Link
                    to="/transactions"
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold shadow-[0_0_15px_rgba(19,236,182,0.3)] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Transaction</span>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                    <button className="flex items-center gap-2 h-10 px-3 rounded-lg bg-slate-100 dark:bg-card-dark border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                            {user?.name?.split(' ')[0] || 'User'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-3 border-b border-slate-100 dark:border-white/5">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
