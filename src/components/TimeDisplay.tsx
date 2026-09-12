
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TimeDisplayProps {
    date: Date | string;
    formatStr?: string;
    className?: string;
}

export default function TimeDisplay({ date, formatStr = "MMMM d, yyyy • h:mm a zzz", className }: TimeDisplayProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder or the server-rendered UTC time (optional, but empty prevents flickering/jumps visually)
        // Returning null causes a layout shift. Returning a localized-looking skeleton is better.
        // Or we can render the UTC time with a specific label?
        // Let's render transparent text to hold space.
        return <span className={`${className} opacity-0`}>Loading...</span>;
    }

    // "zzz" in date-fns gives the timezone abbreviation (e.g. PST, EST)
    // Note: date-fns v2/v3 formatting uses local time by default for Date objects.
    return (
        <span className={className}>
            {format(new Date(date), formatStr)}
        </span>
    );
}
