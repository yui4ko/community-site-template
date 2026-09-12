import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { deletePodcast, togglePodcastVisibility } from '@/actions/podcasts';
import DeletePodcastButton from './DeletePodcastButton';
import ToggleVisibilityButton from './ToggleVisibilityButton';

export default async function AdminPodcastsPage() {
    const podcasts = await prisma.podcast.findMany({
        orderBy: {
            publishDate: 'desc',
        },
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Podcasts</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage FDA knowledge YouTube podcasts.</p>
                </div>
                <Link
                    href="/admin/podcasts/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Podcast
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-y border-gray-100">
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Publish Date</th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {podcasts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-gray-500">
                                    No podcasts added yet. Start by adding one!
                                </td>
                            </tr>
                        ) : (
                            podcasts.map((podcast) => (
                                <tr key={podcast.id} className="hover:bg-gray-50 text-sm transition-colors">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-900">{podcast.title}</p>
                                        <p className="text-gray-500 text-xs truncate max-w-xs">{podcast.description}</p>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {format(new Date(podcast.publishDate), "MMM d, yyyy")}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2 flex justify-end items-center">
                                        <ToggleVisibilityButton id={podcast.id} isHidden={(podcast as any).isHidden} toggleAction={togglePodcastVisibility} />
                                        <Link href={`/admin/podcasts/${podcast.id}/edit`} className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                                            Edit
                                        </Link>
                                        <DeletePodcastButton id={podcast.id} deleteAction={deletePodcast} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
