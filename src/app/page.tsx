import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import NextEventCard from "@/components/NextEventCard";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getAnnouncements } from "@/actions/announcement";
import { getTheme } from "@/actions/theme";

export const dynamic = 'force-dynamic';

async function getUpcomingEvents() {
    try {
        const events = await prisma.event.findMany({
            where: {
                status: "upcoming",
                date: {
                    gte: new Date(),
                },
            },
            orderBy: {
                date: "asc",
            },
            take: 3,
        });
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

async function getPastEvents() {
    try {
        const now = new Date();
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    { status: "past" },
                    {
                        status: "upcoming",
                        date: { lt: now }
                    }
                ]
            },
            orderBy: {
                date: "desc",
            },
            take: 4,
            include: {
                photos: {
                    take: 1,
                    orderBy: { order: 'asc' }
                }
            }
        });
        return events;
    } catch (error) {
        console.error("Error fetching past events:", error);
        return [];
    }
}



async function getLatestNews() {
    try {
        const news = await prisma.news.findMany({
            orderBy: {
                publishDate: "desc",
            },
            take: 3,
        });
        return news;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

export default async function Home() {
    const upcomingEvents = await getUpcomingEvents();
    const pastEvents = await getPastEvents();
    const latestNews = await getLatestNews();
    const activeAnnouncements = await getAnnouncements(false);
    const themeConfig = await getTheme();
    const nextEvent = upcomingEvents[0];

    return (
        <div className="bg-white">
            {/* Announcements */}
            {activeAnnouncements.map((announcement: any) => (
                <div key={announcement.id} className={`w-full py-3 px-4 text-center z-50 relative ${announcement.type === 'warning' ? 'bg-yellow-500 text-black' : announcement.type === 'success' ? 'bg-green-600 text-white' : announcement.type === 'event' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                        <p className="font-bold flex items-center gap-2">
                            {announcement.type === 'event' && <span className="animate-pulse">🎉</span>}
                            {announcement.type === 'warning' && <span>⚠️</span>}
                            {announcement.title}
                        </p>
                        {announcement.description && <span className="text-sm opacity-90 hidden md:block">{announcement.description}</span>}
                        {announcement.linkUrl && (
                            <Link href={announcement.linkUrl} className="underline font-bold whitespace-nowrap bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition">
                                {announcement.linkText || 'Learn More'} →
                            </Link>
                        )}
                    </div>
                </div>
            ))}

            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/90 to-purple-900/90 mix-blend-multiply"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm mb-6">
                            <span className="text-blue-300 font-semibold tracking-wide uppercase text-xs">{themeConfig.hero.badge}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 drop-shadow-sm whitespace-pre-wrap">
                            {themeConfig.hero.title.replace(/\\n/g, '\n')}
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100/90 leading-relaxed font-light">
                            {themeConfig.hero.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link
                                href={themeConfig.hero.primaryLinkUrl}
                                className="bg-white text-brand px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                            >
                                {themeConfig.hero.primaryLinkText}
                            </Link>
                            <a
                                href={themeConfig.hero.secondaryLinkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl font-bold text-white border border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:border-white/60"
                            >
                                {themeConfig.hero.secondaryLinkText}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content: Next Event */}
            <section className="py-12 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-ink flex items-center">
                            <span className="w-2 h-8 bg-brand mr-4 rounded-full"></span>
                            Next Event
                        </h2>
                        <Link
                            href="/events"
                            className="text-brand hover:text-brand-light font-semibold text-sm"
                        >
                            View All Events →
                        </Link>
                    </div>
                    {nextEvent ? (
                        <NextEventCard event={nextEvent} />
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-gray-100">
                            <p className="text-lg">No upcoming events scheduled at the moment.</p>
                            <p className="text-sm mt-2">Check back soon for updates!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Past Events Highlights */}
            {pastEvents.length > 0 && (
                <section className="py-16 bg-white border-t border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-bold text-ink flex items-center">
                                <span className="w-2 h-8 bg-gray-400 mr-4 rounded-full"></span>
                                Recent Event Highlights
                            </h2>
                            <Link href="/events?status=past" className="text-gray-500 hover:text-brand font-semibold text-sm">
                                View Past Archive →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pastEvents.map((event) => (
                                <Link key={event.id} href={`/events/${event.id}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden border-2 border-white shadow-lg hover:shadow-2xl transition-all h-full flex flex-col ring-1 ring-gray-100">
                                        <div className="h-44 bg-gray-200 relative overflow-hidden">
                                            {event.bannerImageUrl ? (
                                                <ImageWithFallback src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fallbackSrc="/images/defaults/event-default-3.png" />
                                            ) : event.photos && event.photos.length > 0 ? (
                                                <ImageWithFallback src={event.photos[0].imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fallbackSrc="/images/defaults/event-default-3.png" />
                                            ) : event.speakerPhotoUrl ? (
                                                <ImageWithFallback src={event.speakerPhotoUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fallbackSrc="/images/defaults/event-default-3.png" />
                                            ) : (
                                                <ImageWithFallback
                                                    src="/images/defaults/event-default-3.png"
                                                    alt="Default Banner"
                                                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            )}
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                {format(new Date(event.date), "MMM d")}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-bold text-ink text-lg mb-3 line-clamp-2 group-hover:text-brand transition-colors leading-tight">{event.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{(event.description || event.abstract || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}</p>
                                            <span className="text-brand text-sm font-bold flex items-center mt-auto">
                                                Recap <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News */}
            {latestNews.length > 0 && (
                <section id="news" className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-ink flex items-center mb-4">
                                    <span className="w-2 h-8 bg-brand mr-4 rounded-full shadow-sm"></span>
                                    Latest News
                                </h2>
                                <p className="text-gray-500 ml-6 text-lg">Updates and announcements from our community</p>
                            </div>
                            <Link
                                href="/news"
                                className="text-brand hover:text-brand-light font-bold flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                            >
                                View All News
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {latestNews.map((newsItem) => (
                                <div
                                    key={newsItem.id}
                                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                                >
                                    {newsItem.imageUrl ? (
                                        <div className="h-56 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/10 transition-colors z-10 duration-500"></div>
                                            <ImageWithFallback
                                                src={newsItem.imageUrl}
                                                alt={newsItem.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                fallbackSrc="/images/defaults/news-default.png"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-56 overflow-hidden relative">
                                            <ImageWithFallback
                                                src="/images/defaults/news-default.png"
                                                alt="Default News"
                                                className="w-full h-full object-cover opacity-80 transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="text-brand text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                                            {format(new Date(newsItem.publishDate), "MMMM d, yyyy")}
                                        </div>
                                        <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-brand transition-colors">
                                            {newsItem.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                                            {newsItem.excerpt || newsItem.content.substring(0, 150) + "..."}
                                        </p>
                                        <Link
                                            href={`/news/${newsItem.id}`}
                                            className="inline-flex items-center text-brand font-bold text-sm group-hover:underline mt-auto"
                                        >
                                            Read Full Story <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}



            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-brand to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-400 blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 blur-3xl opacity-20"></div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Join Our Community
                    </h2>
                    <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Connect with quality professionals, attend expert-led sessions,
                        and stay updated on the latest in quality management.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <a
                            href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-[#1877F2] px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Connect on Facebook
                        </a>
                        {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                            <a
                                href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#0077b5] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#006396] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center justify-center gap-3 border border-white/20"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                Connect on LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
