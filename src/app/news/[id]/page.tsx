import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";
import { siteConfig } from "@/lib/site-config";


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id },
    });

    return {
        title: news ? `${news.title} | ${siteConfig.siteName}` : 'News',
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const newsItem = await prisma.news.findUnique({
        where: { id },
    });

    if (!newsItem) {
        notFound();
    }

    const [prevNews, nextNews] = await Promise.all([
        prisma.news.findFirst({
            where: { publishDate: { lt: newsItem.publishDate } },
            orderBy: { publishDate: 'desc' },
        }),
        prisma.news.findFirst({
            where: { publishDate: { gt: newsItem.publishDate } },
            orderBy: { publishDate: 'asc' },
        }),
    ]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Simple Hero */}
            <div className="bg-ink text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/news" className="text-blue-300 hover:text-white mb-6 inline-flex items-center transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to News
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-medium text-blue-200 mb-4">
                        <span>{format(new Date(newsItem.publishDate), "MMMM d, yyyy")}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        {newsItem.title}
                    </h1>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {newsItem.imageUrl ? (
                        <div className="w-full aspect-video overflow-hidden">
                            <ImageWithFallback
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                                fallbackSrc="/images/defaults/news-default.png"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-video overflow-hidden">
                            <ImageWithFallback
                                src="/images/defaults/news-default.png"
                                alt="Default News"
                                className="w-full h-full object-cover opacity-80"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {newsItem.content}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {prevNews ? (
                                <Link
                                    href={`/news/${prevNews.id}`}
                                    className="group flex flex-col items-start text-left p-4 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand">← Previous</span>
                                    <span className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{prevNews.title}</span>
                                </Link>
                            ) : <div></div>}

                            {nextNews ? (
                                <Link
                                    href={`/news/${nextNews.id}`}
                                    className="group flex flex-col items-end text-right p-4 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand">Next →</span>
                                    <span className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{nextNews.title}</span>
                                </Link>
                            ) : <div></div>}
                        </div>
                    </div>


                </div>
            </article>
        </div>
    );
}
