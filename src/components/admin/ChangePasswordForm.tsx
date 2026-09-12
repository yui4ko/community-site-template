
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changePassword, ChangePasswordState } from '@/actions/auth';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-light transition-colors disabled:opacity-50"
        >
            {pending ? 'Updating...' : 'Change Password'}
        </button>
    );
}

export default function ChangePasswordForm() {
    const [state, formAction] = useActionState(changePassword, null);

    return (
        <form action={formAction} className="space-y-6 max-w-md">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 text-sm font-bold">
                    {state.success}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                    minLength={6}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                    minLength={6}
                />
            </div>

            <SubmitButton />
        </form>
    );
}
