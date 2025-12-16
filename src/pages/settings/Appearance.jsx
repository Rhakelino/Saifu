import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Sun, Moon } from 'lucide-react';

const Appearance = ({ onMenuClick }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-8 flex flex-col gap-8 max-w-[800px]">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Appearance</h1>

                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden p-6 shadow-sm dark:shadow-none">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theme</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 p-4 rounded-xl border ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'} transition-all flex flex-col items-center gap-2`}
                        >
                            <Sun className="w-8 h-8 text-slate-900 dark:text-white" />
                            <span className="text-slate-900 dark:text-white font-medium">Light Mode</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 p-4 rounded-xl border ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'} transition-all flex flex-col items-center gap-2`}
                        >
                            <Moon className="w-8 h-8 text-slate-900 dark:text-white" />
                            <span className="text-slate-900 dark:text-white font-medium">Dark Mode</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Appearance;
