import { getAnnouncements } from "@/actions/announcement";
import AnnouncementManager from "./AnnouncementManager";

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
    const announcements = await getAnnouncements(true);
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">Announcement Banners</h2>
                <p className="text-gray-400">Manage site-wide alerts and event announcements that appear on the homepage.</p>
            </div>
            
            <AnnouncementManager initialData={announcements} />
        </div>
    );
}
