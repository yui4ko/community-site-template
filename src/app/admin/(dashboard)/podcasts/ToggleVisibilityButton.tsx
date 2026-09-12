'use client';

import { useTransition } from 'react';

export default function ToggleVisibilityButton({ 
    id, 
    isHidden,
    toggleAction 
}: { 
    id: string,
    isHidden: boolean,
    toggleAction: (id: string, newVisibility: boolean) => Promise<{ success: boolean; error?: string }> 
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    await toggleAction(id, !isHidden);
                });
            }}
            disabled={isPending}
            className={`font-medium px-2 py-1 rounded transition-colors ${
                isHidden 
                ? 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200' 
                : 'text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100'
            } disabled:opacity-50`}
        >
            {isPending ? 'Saving...' : (isHidden ? 'Unhide' : 'Hide')}
        </button>
    );
}
