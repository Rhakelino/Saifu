import React, { useState } from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Settings = ({ onMenuClick }) => {
    const { t } = useTranslation();
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

    const handleLanguage = () => {
        navigate('/settings/language');
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
            title: t('settings.accountPreferences'),
            items: [
                {
                    icon: "person",
                    label: t('settings.profile'),
                    desc: t('settings.profileDesc'),
                    action: handleProfile
                },
                {
                    icon: "lock",
                    label: t('settings.security'),
                    desc: t('settings.securityDesc'),
                    action: handleSecurity
                },
                {
                    icon: "notifications",
                    label: t('settings.notifications'),
                    desc: t('settings.notificationsDesc'),
                    action: handleNotifications
                }
            ]
        },
        {
            title: t('settings.appSettings'),
            items: [
                {
                    icon: "palette",
                    label: t('settings.appearance'),
                    desc: t('settings.appearanceDesc'),
                    action: handleAppearance
                },
                {
                    icon: "language",
                    label: t('settings.language'),
                    desc: "English / Indonesia",
                    action: handleLanguage
                },
                {
                    icon: "currency_exchange",
                    label: t('settings.currency'),
                    desc: t('settings.currencyDesc'),
                    action: handleCurrency
                }
            ]
        }
    ];

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[1600px]">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>

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
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-900 dark:text-white font-medium">{item.label}</p>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm dark:shadow-none">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.dangerZone')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('settings.irreversibleAction')}</p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-50 text-red-600 dark:text-red-500 dark:hover:bg-red-500/10 transition-colors font-semibold"
                        >
                            {t('settings.deleteAccount')}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Settings;
