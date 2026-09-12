import { prisma } from '@/lib/prisma';
import { updatePodcast } from '@/actions/podcasts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditPodcastPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const podcast = await prisma.podcast.findUnique({
        where: { id }
    });

    if (!podcast) {
        notFound();
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/podcasts" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Podcasts
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">Edit Podcast</h2>
                <p className="text-gray-500 text-sm mt-1">Update the details for this podcast.</p>
            </div>

            <form action={updatePodcast} className="space-y-6">
                <input type="hidden" name="id" value={podcast.id} />
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        defaultValue={podcast.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube Video URL *
                    </label>
                    <input
                        type="url"
                        name="videoUrl"
                        id="videoUrl"
                        required
                        defaultValue={podcast.videoUrl}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        defaultValue={podcast.description || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <Link
                        href="/admin/podcasts"
                        className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
