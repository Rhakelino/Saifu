import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Palette, CircleDollarSign, ChevronRight } from 'lucide-react';

const Settings = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState('IDR');
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    const handleProfile = () => {
        alert("Edit Profile feature coming soon!");
    };

    const handleSecurity = () => {
        setTwoFactor(!twoFactor);
        alert(`Two-factor authentication is now ${!twoFactor ? 'ENABLED' : 'DISABLED'}`);
    };

    const handleNotifications = () => {
        setNotifications(!notifications);
        alert(`Notifications are now ${!notifications ? 'ON' : 'OFF'}`);
    };

    const handleAppearance = () => {
        navigate('/settings/appearance');
    };

    const handleCurrency = () => {
        const newCurr = currency === 'IDR' ? 'USD' : 'IDR';
        setCurrency(newCurr);
        alert(`Currency changed to ${newCurr === 'IDR' ? 'Indonesian Rupiah' : 'United States Dollar'}`);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion request submitted.");
        }
    };

    const settingsSections = [
        {
            title: 'Account Preferences',
            items: [
                {
                    icon: User,
                    label: "Profile Information",
                    desc: "Update your account details",
                    action: handleProfile
                },
                {
                    icon: Lock,
                    label: "Security",
                    desc: "Two-factor authentication and password",
                    action: handleSecurity
                },
                {
                    icon: Bell,
                    label: "Notifications",
                    desc: "Manage your alerts",
                    action: handleNotifications
                }
            ]
        },
        {
            title: 'App Settings',
            items: [
                {
                    icon: Palette,
                    label: "Appearance",
                    desc: "Dark mode enabled by default",
                    action: handleAppearance
                },
                {
                    icon: CircleDollarSign,
                    label: "Currency",
                    desc: "Indonesian Rupiah (IDR)",
                    action: handleCurrency
                }
            ]
        }
    ];

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[1600px]">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {settingsSections.map((section, idx) => (
                        <div key={idx} className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                            </div>
                            <div className="p-2">
                                {section.items.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={item.action}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-surface-dark flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-900 dark:text-white font-medium">{item.label}</p>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm dark:shadow-none">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danger Zone</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Irreversible action for your account.</p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Settings;
