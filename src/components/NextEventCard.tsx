'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TimeDisplay from './TimeDisplay';
import ImageWithFallback from './ImageWithFallback';

// Defined directly in component to avoid type import issues unless needed
interface Event {
    id: string;
    title: string;
    description: string;
    abstract: string | null;
    date: Date;
    speaker: string | null;
    speakerTitle?: string | null;
    speakerPhotoUrl: string | null;
    bannerImageUrl: string | null;
    meetingUrl?: string | null;
    location?: string | null;
}

interface NextEventCardProps {
    event: Event;
}

export default function NextEventCard({ event }: NextEventCardProps) {
    const [isJoinEnabled, setIsJoinEnabled] = useState(false);

    // The join button only appears when the event carries its own meeting link
    // (Admin -> Events -> Meeting URL).
    const hasMeeting = Boolean(event.meetingUrl);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const eventTime = new Date(event.date);
            // 20 minutes before event
            const enableTime = new Date(eventTime.getTime() - 20 * 60 * 1000);

            // Enable if current time is after enableTime
            if (now >= enableTime) {
                setIsJoinEnabled(true);
            } else {
                setIsJoinEnabled(false);
            }
        };

        checkTime();
        // Check every minute
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, [event.date]);

    const addToCalendarUrl = () => {
        // Simple Google Calendar link generator
        const startTime = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endTime = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // Assume 2 hours
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent((event.description || '').replace(/<[^>]*>?/gm, ''));
        const location = encodeURIComponent(event.location || 'See event page');

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`;
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative h-full">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand opacity-20 blur-3xl z-0"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl z-0"></div>

            {/* Left: Speaker Photo or Banner */}
            <div className="md:w-1/3 bg-white/5 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/10 relative z-10">
                {event.speakerPhotoUrl ? (
                    <div className="text-center w-full">
                        <div className="relative inline-block group">
                            {/* Fancy Frame Effect */}
                            <div className="absolute inset-0 border-2 border-brand/50 rounded-lg transform rotate-6 bg-transparent transition-transform group-hover:rotate-12"></div>
                            <div className="absolute inset-0 border-2 border-purple-500/50 rounded-lg transform -rotate-3 bg-transparent transition-transform group-hover:-rotate-6"></div>

                            <div className="relative p-1 rounded-lg backdrop-blur-sm z-10 transition-transform group-hover:scale-105">
                                <ImageWithFallback
                                    src={event.speakerPhotoUrl}
                                    fallbackSrc="/images/defaults/event-default-1.png"
                                    alt={event.speaker || "Speaker"}
                                    className="w-40 h-40 object-cover rounded shadow-2xl border border-white/20 bg-gray-800"
                                />
                            </div>
                        </div>
                        {event.speaker && (
                            <h4 className="mt-6 font-bold text-xl text-white tracking-wide">{event.speaker}</h4>
                        )}
                        {event.speakerTitle && (
                            <p className="mt-1 text-sm text-gray-400">{event.speakerTitle}</p>
                        )}
                    </div>
                ) : event.bannerImageUrl ? (
                    <div className="w-full h-full relative group overflow-hidden">
                        <ImageWithFallback
                            src={event.bannerImageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover min-h-[240px] transition-transform duration-700 group-hover:scale-110"
                            fallbackSrc="/images/defaults/event-default-1.png"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                ) : (
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.speaker && (
                            <h4 className="mt-6 font-bold text-xl text-white tracking-wide">{event.speaker}</h4>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Content & Buttons */}
            <div className="md:w-2/3 p-8 flex flex-col relative z-10">
                <div className="flex-grow">
                    <div className="inline-block px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <TimeDisplay date={event.date} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white leading-tight">{event.title}</h3>

                    <Link href={`/events/${event.id}`} className="block group/text">
                        <p className="text-gray-300 mb-6 text-base leading-relaxed line-clamp-3 md:line-clamp-6 lg:line-clamp-[12] font-light group-hover/text:text-blue-300 transition-colors">
                            {(event.abstract || event.description || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                            <span className="inline-block ml-1 text-blue-400 font-medium text-xs opacity-0 group-hover/text:opacity-100 transition-opacity">
                                (Read More)
                            </span>
                        </p>
                    </Link>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-white/10 items-center">
                    {/* Join Button — only when the event has a meeting link */}
                    {hasMeeting && (
                    <a
                        href={isJoinEnabled ? (event.meetingUrl as string) : undefined}
                        className={`flex-1 text-center px-6 py-3 rounded-xl font-bold text-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${isJoinEnabled
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transform hover:-translate-y-0.5 cursor-pointer border border-red-400"
                            : "bg-gray-700/50 text-gray-500 border border-gray-600/50 cursor-not-allowed"
                            }`}
                        onClick={(e) => !isJoinEnabled && e.preventDefault()}
                        title={isJoinEnabled ? "Join Now" : "Link opens 20 mins before event"}
                    >
                        {isJoinEnabled && <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>}
                        {isJoinEnabled ? "Join Meeting Now" : "Join Meeting"}
                    </a>
                    )}

                    {/* View Details */}
                    <Link
                        href={`/events/${event.id}`}
                        className="flex-1 text-center bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm w-full sm:w-auto hover:border-white/30 backdrop-blur-sm"
                    >
                        View Details
                    </Link>

                    {/* Add to Calendar */}
                    <a
                        href={addToCalendarUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-none flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors hover:border-white/30 backdrop-blur-sm"
                        title="Add to Google Calendar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
                {hasMeeting && !isJoinEnabled && (
                    <p className="text-xs text-gray-500 mt-3 text-center sm:text-left flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Link becomes active 20 mins before start
                    </p>
                )}
            </div>
        </div>
    );
}
