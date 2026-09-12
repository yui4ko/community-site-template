
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

async function getStats() {
    const eventCount = await prisma.event.count();
    const newsCount = await prisma.news.count();
    const upcomingEvents = await prisma.event.findMany({
        where: {
            status: "upcoming",
            date: { gte: new Date() }
        },
        orderBy: { date: "asc" },
        take: 5
    });

    return { eventCount, newsCount, upcomingEvents };
}

export default async function AdminDashboard() {
    const { eventCount, newsCount, upcomingEvents } = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 font-medium mb-2">Total Events</div>
                    <div className="text-4xl font-bold text-slate-900">{eventCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 font-medium mb-2">News Posts</div>
                    <div className="text-4xl font-bold text-brand">{newsCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                    <div className="text-white/80 font-medium mb-2">Quick Action</div>
                    <Link href="/admin/events/new" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-bold transition-colors">
                        + Create New Event
                    </Link>
                </div>
            </div>

            {/* Recent Activity / Upcoming List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Upcoming Events</h2>
                    <Link href="/admin/events" className="text-brand hover:text-brand-light font-semibold text-sm">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand/5 text-brand flex items-center justify-center font-bold text-sm">
                                    {format(new Date(event.date), "dd")}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{event.title}</h3>
                                    <p className="text-gray-500 text-sm">{format(new Date(event.date), "MMM d, yyyy • h:mm a")}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/events/${event.id}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No upcoming events found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
