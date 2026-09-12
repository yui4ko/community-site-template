import { createPodcast } from '@/actions/podcasts';
import Link from 'next/link';

export default function NewPodcastPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/podcasts" className="text-brand hover:text-brand-light text-sm font-medium mb-4 inline-block flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Podcasts
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">Add New Podcast</h2>
                <p className="text-gray-500 text-sm mt-1">Embed a new FDA knowledge YouTube video.</p>
            </div>

            <form action={createPodcast} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="e.g. FDA Guidelines on Food Safety"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
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
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste the full YouTube link here. We will extract the video automatically.</p>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        placeholder="Brief summary of the podcast content..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
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
                        className="bg-brand hover:bg-brand-light text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Save Podcast
                    </button>
                </div>
            </form>
        </div>
    );
}
