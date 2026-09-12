
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
    const newsList = await prisma.news.findMany({
        orderBy: { publishDate: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                <Link
                    href="/admin/news/new"
                    className="bg-brand hover:bg-brand-light text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                    + Create News
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {newsList.map((news) => (
                                <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {format(new Date(news.publishDate), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 line-clamp-1">{news.title}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{news.excerpt}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <Link
                                            href={`/admin/news/${news.id}`}
                                            className="inline-block text-brand hover:text-brand-light font-bold text-sm px-3 py-1 rounded-lg hover:bg-brand/5 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <DeleteNewsButton id={news.id} />
                                    </td>
                                </tr>
                            ))}
                            {newsList.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        No news found.
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
