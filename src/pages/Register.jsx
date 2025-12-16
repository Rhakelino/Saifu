import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../lib/authClient';
import { Wallet, AlertCircle, Loader2, UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp.email({
                email,
                password,
                name,
            });

            if (result.error) {
                setError(result.error.message || 'Registration failed');
            }
            // If successful, AuthContext will handle redirect
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <Wallet className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Start your financial journey with Saifu.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-white/5 p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-primary focus:border-transparent p-4 font-medium placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-primary focus:border-transparent p-4 font-medium placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-primary focus:border-transparent p-4 font-medium placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-primary focus:border-transparent p-4 font-medium placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-primary text-[#10221d] font-bold text-lg hover:shadow-[0_0_20px_rgba(19,236,182,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-6 h-6" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 text-xs mt-8">
                    © 2024 Saifu. Personal Finance Made Simple.
                </p>
            </div>
        </div>
    );
};

export default Register;
