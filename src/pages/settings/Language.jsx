import React from 'react';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';

const Language = ({ onMenuClick }) => {
    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'English (US)', flag: '🇺🇸' },
        { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[800px]">
                <h1 className="text-3xl font-bold text-white">{t('settings.language')}</h1>

                <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${i18n.language === lang.code ? 'bg-primary/20 border border-primary/50' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <span className="text-2xl">{lang.flag}</span>
                                <div className="flex-1">
                                    <p className={`font-medium ${i18n.language === lang.code ? 'text-primary' : 'text-white'}`}>{lang.label}</p>
                                </div>
                                {i18n.language === lang.code && (
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Language;
