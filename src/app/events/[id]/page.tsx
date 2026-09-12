
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ImageWithFallback from '@/components/ImageWithFallback';
import PhotoGallery from '@/components/PhotoGallery';
import TimeDisplay from '@/components/TimeDisplay';
import { notFound } from 'next/navigation';
import { addMinutes, addDays } from 'date-fns';
import { Metadata } from 'next';
import JoinMeetingButton from '@/components/JoinMeetingButton';
import ShareButtons from '@/components/ShareButtons';
import { siteConfig } from '@/lib/site-config';


export const metadata: Metadata = {
    title: `Event Details | ${siteConfig.siteName}`,
};

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            photos: {
                orderBy: { order: 'asc' }
            }
        }
    });
    return event as any;
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.date);
    const isEventPast = new Date() > addDays(eventDate, 1); // Event stays active until next day
    const showJoinButton = !isEventPast && new Date() >= addMinutes(eventDate, -20) && new Date() <= addMinutes(eventDate, 120);

    // Google Calendar Link Construction - Use UTC format (Z) to ensure consistent timezone across devices
    const getCalendarDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const startTime = getCalendarDate(eventDate);
    const endTime = getCalendarDate(addMinutes(eventDate, 90)); // Approx 1.5h
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent((event.description || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '))}&location=${encodeURIComponent(event.location || 'Online')}&sf=true&output=xml`;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-96 w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    {event.bannerImageUrl ? (
                        <ImageWithFallback src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <img src="/images/defaults/event-default-1.png" alt="Default Hero" className="w-full h-full object-cover opacity-40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 max-w-7xl mx-auto z-10">
                    <Link href="/events" className="inline-flex items-center text-blue-300 hover:text-white mb-6 transition-colors font-semibold">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Events
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-wider text-blue-200 mb-4">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <TimeDisplay date={eventDate} formatStr="MMMM d, yyyy" />
                        </span>
                        <span className="bg-brand/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <TimeDisplay date={eventDate} formatStr="h:mm a zzz" />
                        </span>
                        {event.type && (
                            <span className="bg-purple-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                {event.type.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
                        {event.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Custom 1200x628 Banner Slot */}
                        {/* Custom 1200x628 Banner Slot */}
                        {/* Custom 1200x628 Banner Slot */}
                        {event.bannerImageUrl && (
                            <div className="w-full aspect-[1200/628] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200 relative group">
                                <ImageWithFallback src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        )}

                        {/* Speaker Card */}
                        {event.speaker && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {event.speakerPhotoUrl ? (
                                    <div className="relative p-1 bg-white rounded-2xl shadow-xl border border-gray-100 rotate-1 sm:rotate-0">
                                        <ImageWithFallback
                                            src={event.speakerPhotoUrl}
                                            alt={event.speaker}
                                            className="w-32 h-32 rounded-xl object-cover"
                                            fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.speaker || 'Speaker')}&background=random`}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner overflow-hidden">
                                        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className="text-center sm:text-left flex-1">
                                    <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wide text-xs mb-1">Featuring Speaker</h3>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{event.speaker}</h2>
                                    {event.speakerTitle && (
                                        <p className="text-brand font-bold mb-3">{event.speakerTitle}</p>
                                    )}
                                    {event.speakerBio && (
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {event.speakerBio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Abstract / Description */}
                        {(event.description || event.abstract) && (
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-brand rounded-full"></span>
                                    About This Event
                                </h3>
                                <div
                                    className="prose prose-lg text-gray-600 max-w-none"
                                    dangerouslySetInnerHTML={{ __html: (event.description || event.abstract || '').replace(/&nbsp;/g, ' ') }}
                                />
                            </div>
                        )}

                        {/* Photo Gallery */}
                        <PhotoGallery photos={event.photos} />


                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
                            <div className="text-center mb-8">
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Date & Time</div>
                                <div className="text-2xl font-black text-slate-900 mb-1">
                                    <TimeDisplay date={eventDate} formatStr="EEEE, MMM d" />
                                </div>
                                <div className="text-xl text-brand font-bold">
                                    <TimeDisplay date={eventDate} formatStr="h:mm a zzz" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!isEventPast && (event.deliveryMethod === 'online' || event.deliveryMethod === 'hybrid') && (
                                    <JoinMeetingButton
                                        meetingUrl={event.meetingUrl}
                                        eventDate={eventDate}
                                        showJoinButton={showJoinButton}
                                    />
                                )}

                                {!isEventPast && (
                                    <a
                                        href={googleCalendarUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white border-2 border-brand text-brand py-4 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors"
                                    >
                                        Add to Google Calendar
                                    </a>
                                )}

                                {isEventPast && (
                                    <div className="space-y-3">
                                        {event.slidesUrl && (
                                            <a href={event.slidesUrl} target="_blank" className="flex items-center justify-center gap-2 w-full bg-blue-50 text-brand py-3 rounded-xl font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                                Download Slides
                                            </a>
                                        )}
                                        {event.recordingUrl && (
                                            <a href={event.recordingUrl} target="_blank" className="flex items-center justify-center gap-2 w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold border border-purple-100 hover:bg-purple-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                Watch Recording
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Share */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <ShareButtons title={event.title} />
                            </div>

                            {/* Location / Map */}
                            {(event.deliveryMethod === 'onsite' || event.deliveryMethod === 'hybrid') && (
                                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-full text-brand">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Venue</h4>
                                            <p className="text-gray-900 font-medium mt-1">{event.location}</p>
                                            <p className="text-gray-500 text-sm">{event.address}</p>
                                        </div>
                                    </div>

                                    {event.mapUrl && (
                                        <div className="rounded-2xl overflow-hidden border border-gray-100 h-48 bg-gray-50">
                                            {event.mapUrl.includes('<iframe') ? (
                                                <div dangerouslySetInnerHTML={{ __html: event.mapUrl }} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" />
                                            ) : (
                                                <a
                                                    href={event.mapUrl}
                                                    target="_blank"
                                                    className="w-full h-full flex items-center justify-center text-brand font-bold hover:bg-blue-100 transition-colors gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    View on Google Maps
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {event.deliveryMethod === 'online' && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-full text-brand">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Online Event</h4>
                                            <p className="text-gray-600 text-sm mt-1">This is a virtual meeting via {event.location || "Zoom"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
