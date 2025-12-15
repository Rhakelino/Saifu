import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen }) => {
    const { t } = useTranslation();

    const navItems = [
        { path: "/", icon: "dashboard", label: t('sidebar.dashboard') },
        { path: "/transactions", icon: "sync_alt", label: t('sidebar.transactions') },
        { path: "/analytics", icon: "monitoring", label: t('sidebar.analytics') },
        { path: "/wallets", icon: "wallet", label: t('sidebar.wallets') },
        { path: "/settings", icon: "settings", label: t('sidebar.settings') }
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-white/5 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
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
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className={`text-sm ${item.path === "/" ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-card-dark border border-slate-200 dark:border-white/5">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border-2 border-primary"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQU70nWBBBZJulzKNaw2Z3YtwQIMxZ8AGQUF118O_gi4m1FFnmxiG3Qa-WIMC8c12KHQmlv_oII9VI_DZNs982NFOjOOcIKMI5bQPQG3F4rGXK3FQWYOjqdH0YeXawOuAerGdTHnYIDGT-MFHbE1ueZCRrecGD_sIz1SFZDVSXnYZ59Vmv_UpIoVMi7xhTHLEfbvcaxkCCvih6WBcB5iFBGRJw8TXl7sRoh7pUnpeIIjI03AcEcQQAq05mk1nPj0TtKOe3RHMuqOhm")' }}></div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">Alex Johnson</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs truncate">Premium Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );

};

export default Sidebar;
