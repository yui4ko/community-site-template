import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ImageWithFallback from "@/components/ImageWithFallback";
import { siteConfig } from "@/lib/site-config";

async function getAllNews() {
    try {
        const news = await prisma.news.findMany({
            orderBy: {
                publishDate: "desc",
            },
        });
        return news;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

export default async function NewsPage() {
    const allNews = await getAllNews();

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand to-brand-light text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Announcements</h1>
                    <p className="text-xl text-blue-100">
                        Stay updated with the latest news from {siteConfig.siteName}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {allNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allNews.map((newsItem) => (
                            <div
                                key={newsItem.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                            >
                                {newsItem.imageUrl ? (
                                    <div className="h-48 overflow-hidden">
                                        <ImageWithFallback
                                            src={newsItem.imageUrl}
                                            alt={newsItem.title}
                                            className="w-full h-full object-cover"
                                            fallbackSrc="/images/defaults/news-default.png"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 overflow-hidden">
                                        <ImageWithFallback
                                            src="/images/defaults/news-default.png"
                                            alt="Default News"
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="text-gray-500 text-sm mb-2">
                                        {format(new Date(newsItem.publishDate), "MMMM d, yyyy")}
                                    </div>
                                    <h3 className="text-xl font-bold text-ink mb-3 line-clamp-2">
                                        {newsItem.title}
                                    </h3>
                                    <p className="text-gray-700 mb-4 line-clamp-4">
                                        {newsItem.excerpt || newsItem.content.substring(0, 200) + "..."}
                                    </p>
                                    <Link
                                        href={`/news/${newsItem.id}`}
                                        className="text-brand hover:text-brand-light font-semibold text-sm inline-flex items-center gap-1"
                                    >
                                        Read More
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No news articles found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
