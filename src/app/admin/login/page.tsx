
'use client';

import { login } from '@/actions/auth';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? 'Signing in...' : 'Sign In'}
        </button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(async (prevState: { error?: string } | null, formData: FormData) => {
        const result = await login(formData);
        if (result?.error) {
            return { error: result.error };
        }
        return null; // Return null on success or redirect happens
    }, null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-brand mb-2">Admin Panel</h1>
                    <p className="text-gray-500">Sign in to manage the website</p>
                </div>

                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl border border-red-100 text-center font-bold">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
