
'use client';

import { deleteNews } from '@/actions/news';

export default function DeleteNewsButton({ id }: { id: string }) {
    return (
        // @ts-ignore
        <form action={deleteNews.bind(null, id)} className="inline-block">
            <button
                type="submit"
                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors ml-2"
                title="Delete News"
                onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this news item?')) {
                        e.preventDefault();
                    }
                }}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </form>
    );
}
