
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { format } from 'date-fns';
import UploadButton from './UploadButton';

type ActionState = {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
} | null;

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-1 bg-brand text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {pending ? 'Saving...' : (isEdit ? 'Update News' : 'Create News')}
        </button>
    );
}

const formatDateForInput = (date?: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return format(d, "yyyy-MM-dd'T'HH:mm");
};

export default function NewsForm({ action, initialData }: { action: (state: ActionState, formData: FormData) => Promise<ActionState>, initialData?: any }) {
    const [state, formAction] = useActionState(action, null);

    return (
        <form action={formAction} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    <p className="font-bold">{state.error}</p>
                    {state.fieldErrors && (
                        <ul className="list-disc list-inside mt-2 text-sm">
                            {Object.entries(state.fieldErrors).map(([key, errors]: [string, any]) => (
                                <li key={key}>{errors}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                        <input name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none font-bold text-lg" placeholder="Enter news headline..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt (Summary)</label>
                        <textarea name="excerpt" rows={3} defaultValue={initialData?.excerpt} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" placeholder="Short description for the list view..." />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Content *</label>
                        <textarea name="content" rows={12} defaultValue={initialData?.content} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none resize-y" placeholder="Full news content..." />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Publish Date *</label>
                        <input
                            type="datetime-local"
                            name="publishDate"
                            defaultValue={formatDateForInput(initialData?.publishDate || new Date())}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                        />
                    </div>

                    <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
                        <label className="block text-sm font-bold text-brand mb-2">Featured Image</label>
                        <p className="text-[10px] text-gray-500 mb-2 italic">Displayed as the cover image for this news article.</p>
                        <input id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none text-xs mb-2 bg-white" placeholder="https://..." />
                        <UploadButton label="Upload Cover Image" onUploadComplete={(url: string) => {
                            const el = document.getElementById('imageUrl') as HTMLInputElement;
                            if (el) el.value = url;
                        }} />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Link href="/admin/news" className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center">
                    Cancel
                </Link>
                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    );
}
