import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Metadata } from "next";
import VideoEmbed from "@/components/VideoEmbed";
import { siteConfig } from "@/lib/site-config";

const label = siteConfig.admin?.podcastLabel || "Podcasts";

export const metadata: Metadata = {
    title: `${label} | ${siteConfig.siteName}`,
    description: `Recorded sessions and episodes from ${siteConfig.siteName}.`,
};

export const dynamic = 'force-dynamic';

async function getPodcasts() {
    try {
        return await prisma.podcast.findMany({
            where: { isHidden: false },
            orderBy: { publishDate: "desc" },
        });
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        return [];
    }
}

export default async function PodcastsPage() {
    const podcasts = await getPodcasts();

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-r from-brand to-brand-light text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{label}</h1>
                    <p className="text-xl text-blue-100">
                        Recorded sessions and episodes from {siteConfig.siteName}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
                {podcasts.length > 0 ? (
                    <div className="space-y-12">
                        {podcasts.map((podcast) => (
                            <article key={podcast.id}>
                                <VideoEmbed url={podcast.videoUrl} title={podcast.title} />
                                <div className="mt-5">
                                    <p className="text-brand text-xs font-bold uppercase tracking-wider mb-2">
                                        {format(new Date(podcast.publishDate), "MMMM d, yyyy")}
                                    </p>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{podcast.title}</h2>
                                    {podcast.description && (
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {podcast.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No episodes published yet.</p>
                        <p className="text-sm mt-2">Add one from Admin → {label}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
