
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NewsForm from '@/components/admin/NewsForm';
import { updateNews } from '@/actions/news';

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const news = await prisma.news.findUnique({
        where: { id: params.id },
    });

    if (!news) {
        notFound();
    }

    const updateNewsWithId = updateNews.bind(null, news.id);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit News</h1>
                <p className="text-gray-500">Update this announcement.</p>
            </div>
            <NewsForm action={updateNewsWithId} initialData={news} />
        </div>
    );
}
