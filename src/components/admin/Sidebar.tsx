'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/actions/auth';
import { siteConfig } from '@/lib/site-config';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Announcements', href: '/admin/announcements' },
    { label: 'Events', href: '/admin/events' },
    { label: 'News', href: '/admin/news' },
    { label: 'Podcasts', href: '/admin/podcasts' },
    { label: 'User Management', href: '/admin/users' },
    { label: 'Theme Settings', href: '/admin/theme' },
    { label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 z-[60] p-4 flex justify-between items-center text-white border-b border-white/10 shadow-md">
                <span className="font-bold flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    {siteConfig.admin?.sidebarTitle || 'Admin'}
                </span>
                <button onClick={toggleSidebar} className="p-2 -mr-2 text-gray-300 hover:text-white">
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[55] md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static top-0 left-0 h-[100dvh] md:h-auto z-[70] 
                w-64 bg-slate-900 text-white flex-shrink-0 
                transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {siteConfig.admin?.sidebarTitle || 'Admin'}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">Content Management</p>
                    </div>
                    {/* Close button inside sidebar (mobile only) */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // Close on navigate
                                className={`block px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-gray-800">
                        <form action={logout}>
                            <button
                                type="submit"
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors font-medium text-sm flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>
        </>
    );
}
