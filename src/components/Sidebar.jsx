import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowRightLeft,
    LineChart,
    Wallet,
    LayoutGrid,
    Settings
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
    const navItems = [
        { path: "/", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/transactions", icon: ArrowRightLeft, label: "Transactions" },
        { path: "/analytics", icon: LineChart, label: "Analytics" },
        { path: "/wallets", icon: Wallet, label: "Wallets" },
        { path: "/categories", icon: LayoutGrid, label: "Categories" },
        { path: "/settings", icon: Settings, label: "Settings" }
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-white/5 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Saifu</h1>
            </div>
            <nav className="flex-1 px-4 flex flex-col gap-2 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-primary/20 text-primary"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                            }`
                        }
                    >
                        <item.icon className="w-6 h-6" />
                        <span className={`text-sm ${item.path === "/" ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
