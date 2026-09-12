
import { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/admin/login');
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        redirect('/user/settings'); // Redirect ordinary users away from the admin area
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-12 overflow-y-auto pt-20 md:pt-12">
                {children}
            </main>
        </div>
    );
}
