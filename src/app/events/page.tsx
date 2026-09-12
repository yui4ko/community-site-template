import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format, addDays } from "date-fns";
import { Metadata } from "next";
import { Event } from "@prisma/client";
import ImageWithFallback from "@/components/ImageWithFallback";
import TimeDisplay from "@/components/TimeDisplay";
import CalendarView from "@/components/CalendarView";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
    title: `Events | ${siteConfig.siteName}`,
    description: "Join us for quality-focused tech talks, workshops, and networking events.",
};

export const dynamic = 'force-dynamic';

async function getEvents() {
    const allEvents = await prisma.event.findMany({
        orderBy: { date: "asc" },
    });

    const now = new Date();

    const upcomingEvents = allEvents.filter(event =>
        event.status === "upcoming" && addDays(new Date(event.date), 1) >= now
    );

    const pastEvents = allEvents
        .filter(event =>
            event.status === "past" ||
            (event.status === "upcoming" && addDays(new Date(event.date), 1) < now)
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Descending for past list
        .slice(0, 20); // Keep the limit for the list view

    return { allEvents, upcomingEvents, pastEvents };
}

export default async function EventsPage() {
    const { allEvents, upcomingEvents, pastEvents } = await getEvents();

    // Filter filtering hidden events from the list view
    const visibleUpcomingEvents = upcomingEvents.filter(e => {
        // @ts-ignore - property exists on runtime model but Typescript might not know yet until generation
        return e.showInList !== false;
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const calendarUrl = `${siteUrl}/api/calendar`;
    const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarUrl.replace('https://', 'webcal://').replace('http://', 'webcal://'))}`;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/90 to-purple-900/90 mix-blend-multiply"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Events & Workshops</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
                        Join us for quality-focused tech talks, workshops, and networking events designed to elevate your career.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                {/* Calendar Section */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-2 bg-purple-500 rounded-full"></div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">Event Calendar</h2>
                                <p className="text-gray-500 mt-1">View all upcoming events at a glance</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/api/calendar"
                                className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download ICS
                            </a>
                            <a
                                href={googleCalendarUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 16H5V8h14v12zm-2-7h-4v-4h4v4zm-6 0H7v-4h4v4zm6 6h-4v-4h4v4zm-6 0H7v-4h4v4z" /></svg>
                                Subscribe (Google)
                            </a>
                        </div>
                    </div>

                    <CalendarView events={allEvents} />

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                            <h4 className="font-bold text-brand text-sm">How to Subscribe?</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                <strong>Mobile:</strong> Tap "Download ICS" to add to Apple Calendar or Android Calendar.<br />
                                <strong>Desktop:</strong> Click "Subscribe (Google)" to add to your Google Calendar, or download the ICS file to import into Outlook.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events */}
                {visibleUpcomingEvents.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-10 w-2 bg-brand rounded-full"></div>
                            <h2 className="text-3xl font-bold text-slate-800">Upcoming Events</h2>
                        </div>
                        <div className="space-y-8">
                            {visibleUpcomingEvents.map((event) => (
                                <UpcomingEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-10 w-2 bg-purple-600 rounded-full"></div>
                            <h2 className="text-3xl font-bold text-slate-800">Past Events</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastEvents.map((event) => (
                                <PastEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {visibleUpcomingEvents.length === 0 && pastEvents.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-lg">No events found at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

type ExtendedEvent = Event & {
    location?: string | null;
    meetingUrl?: string | null;
};

function UpcomingEventCard({ event }: { event: ExtendedEvent }) {
    return (
        <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="md:flex">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-slate-900 flex items-center justify-center">
                    {event.bannerImageUrl && (
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 transform scale-110"
                            style={{ backgroundImage: `url('${event.bannerImageUrl}')` }}
                        />
                    )}
                    {event.bannerImageUrl ? (
                        <ImageWithFallback
                            src={event.bannerImageUrl}
                            alt={event.title}
                            className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <ImageWithFallback
                            src="/images/defaults/event-default-1.png"
                            alt="Default Banner"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-lg">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <TimeDisplay date={event.date} formatStr="MMM" />
                        </div>
                        <div className="text-2xl font-black text-brand">
                            <TimeDisplay date={event.date} formatStr="d" />
                        </div>
                    </div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-brand font-bold text-sm mb-3 uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <TimeDisplay date={event.date} formatStr="h:mm a zzz" />
                        </span>
                        {event.location && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span>{event.location}</span>
                            </>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand transition-colors">
                        {event.title}
                    </h3>

                    <Link href={`/events/${event.id}`} className="block group/text">
                        <p className="text-gray-600 mb-6 line-clamp-3 md:line-clamp-6 lg:line-clamp-[12] leading-relaxed group-hover/text:text-brand transition-colors">
                            {(event.abstract || event.description || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                            <span className="inline-block ml-1 text-brand font-bold text-xs opacity-0 group-hover/text:opacity-100 transition-opacity">
                                (Read More)
                            </span>
                        </p>
                    </Link>

                    <div className="flex items-center justify-between mt-auto">
                        {event.speaker ? (
                            <div className="flex items-center gap-3">
                                {event.speakerPhotoUrl ? (
                                    <ImageWithFallback src={event.speakerPhotoUrl} alt={event.speaker} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-brand-light text-white flex items-center justify-center font-bold text-sm shadow-md">
                                        {event.speaker.charAt(0)}
                                    </div>
                                )}
                                <div className="text-sm">
                                    <p className="font-bold text-gray-900">{event.speaker}</p>
                                    <p className="text-gray-500 text-xs">Speaker</p>
                                </div>
                            </div>
                        ) : <div></div>}

                        <Link
                            href={`/events/${event.id}`}
                            className="inline-flex items-center gap-2 bg-brand/10 text-brand px-6 py-3 rounded-xl font-bold hover:bg-brand hover:text-white transition-all"
                        >
                            View Details <span className="text-lg">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PastEventCard({ event }: { event: ExtendedEvent }) {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
            <div className="h-48 overflow-hidden relative bg-slate-900 flex items-center justify-center">
                {event.bannerImageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 transform scale-110"
                        style={{ backgroundImage: `url('${event.bannerImageUrl}')` }}
                    />
                )}
                {event.bannerImageUrl ? (
                    <ImageWithFallback
                        src={event.bannerImageUrl}
                        alt={event.title}
                        className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                        fallbackSrc="/images/defaults/event-default-2.png"
                    />
                ) : (
                    <ImageWithFallback
                        src="/images/defaults/event-default-2.png"
                        alt="Default Banner"
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="text-white text-xs font-bold uppercase tracking-wider">
                        <TimeDisplay date={event.date} formatStr="MMMM d, yyyy" />
                    </div>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-brand transition-colors">
                    {event.title}
                </h3>
                {event.speaker && (
                    <p className="text-gray-500 text-sm mb-4">feat. {event.speaker}</p>
                )}

                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                    {event.slidesUrl && (
                        <a href={event.slidesUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Slides
                        </a>
                    )}
                    {event.recordingUrl && (
                        <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Recording
                        </a>
                    )}
                    <div className="ml-auto">
                        <Link href={`/events/${event.id}`} className="text-xs font-bold text-gray-400 hover:text-gray-600">Details</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
