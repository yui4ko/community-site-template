'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import Link from 'next/link';
import { Event } from '@prisma/client';

export default function CalendarView({ events }: { events: Event[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart); // Default starts on Sunday
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-2xl font-bold">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
                {days.map((day, dayIdx) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
                    const hasEvents = dayEvents.length > 0;
                    const isSelectedMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={`
                                min-h-[100px] bg-white p-2 relative group transition-colors
                                ${!isSelectedMonth ? 'bg-gray-50/50 text-gray-400' : 'text-gray-900'}
                                ${isToday(day) ? 'bg-blue-50/30' : ''}
                                hover:bg-gray-50 z-0
                            `}
                        >
                            <span className={`
                                text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                                ${isToday(day) ? 'bg-brand text-white shadow-md' : ''}
                            `}>
                                {format(day, dateFormat)}
                            </span>

                            {/* Event Dots / Bars */}
                            <div className="mt-1 space-y-1">
                                {dayEvents.map(event => (
                                    <Link key={event.id} href={`/events/${event.id}`} className="block">
                                        <div className={`
                                            text-xs px-2 py-1 rounded-md truncate font-medium
                                            ${new Date(event.date) < new Date() ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-brand hover:bg-brand hover:text-white'}
                                            transition-colors
                                        `}>
                                            {format(new Date(event.date), 'h:mm a')} {event.title}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
