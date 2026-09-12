
import NewsForm from '@/components/admin/NewsForm';
import { createNews } from '@/actions/news';

export default function NewNewsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create News</h1>
                <p className="text-gray-500">Share announcements and updates with the community.</p>
            </div>
            <NewsForm action={createNews} />
        </div>
    );
}
