
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
                <Link
                    href="/admin/events/new"
                    className="bg-brand hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                    + Create Event
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {format(new Date(event.date), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{event.title}</div>
                                        {event.speaker && <div className="text-sm text-gray-500">{event.speaker}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/events/${event.id}`}
                                            className="inline-block text-blue-600 hover:text-blue-800 font-bold text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <DeleteEventButton id={event.id} />
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No events found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
