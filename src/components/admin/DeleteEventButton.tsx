
'use client';

import { deleteEvent } from '@/actions/events';

export default function DeleteEventButton({ id }: { id: string }) {
    return (
        // @ts-ignore
        <form action={deleteEvent.bind(null, id)} className="inline-block">
            <button
                type="submit"
                className="text-red-500 hover:text-red-700 font-bold text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this event?')) {
                        e.preventDefault();
                    }
                }}
            >
                Delete
            </button>
        </form>
    );
}
