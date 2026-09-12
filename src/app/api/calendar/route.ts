
import { prisma } from '@/lib/prisma';
import { createEvents } from 'ics';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

/**
 * The public origin for links inside the feed.
 *
 * NEXT_PUBLIC_SITE_URL first, then the host the request actually arrived on,
 * and theme.json's siteUrl only as a last resort — it ships as a placeholder,
 * so the real host beats it. Without these fallbacks a missing env var produced
 * "undefined/events/..." and the ics library rejected the whole feed with a 500.
 */
async function resolveBaseUrl(): Promise<string> {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
    if (fromEnv && /^https?:\/\//.test(fromEnv)) {
        return fromEnv.replace(/\/+$/, '');
    }

    const h = await headers();
    const host = h.get('host');
    if (host) {
        const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
        return `${proto}://${host}`;
    }

    if (siteConfig.siteUrl && /^https?:\/\//.test(siteConfig.siteUrl)) {
        return siteConfig.siteUrl.replace(/\/+$/, '');
    }

    return 'http://localhost:3000';
}

export async function GET() {
    try {
        const baseUrl = await resolveBaseUrl();
        const events = await prisma.event.findMany({
            where: {
                status: 'upcoming',
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Map database events to ICS format
        const icsEvents = events.map((event) => {
            const startDate = new Date(event.date);

            return {
                start: [
                    startDate.getUTCFullYear(),
                    startDate.getUTCMonth() + 1,
                    startDate.getUTCDate(),
                    startDate.getUTCHours(),
                    startDate.getUTCMinutes(),
                ] as [number, number, number, number, number],
                duration: { hours: 2, minutes: 0 },
                title: event.title,
                description: (event.description || event.abstract || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '),
                location: event.location || 'Online',
                url: `${baseUrl}/events/${event.id}`,
                uid: event.id,
                categories: siteConfig.calendar.categories,
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                organizer: { name: siteConfig.calendar.organizerName, email: siteConfig.contactEmail },
            };
        });

        // Generate ICS file content
        const { error, value } = createEvents(icsEvents as any);

        if (error) {
            console.error('Error generating ICS:', error);
            return new NextResponse('Error generating calendar file', { status: 500 });
        }

        // Return with appropriate headers for calendar subscription
        return new NextResponse(value, {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="${siteConfig.calendar.icsFilename}"`,
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Calendar API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
