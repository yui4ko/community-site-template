"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({ session, themeConfig }: { session: any, themeConfig: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    return (
        <header className="bg-brand-deep shadow-md sticky top-0 z-50 font-sans">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo Section - Left */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group" aria-label={themeConfig.siteName}>
                            {/* Falls back to the site name until a logo file is added,
                                so a fresh install never shows a broken image. */}
                            {logoFailed || !themeConfig.logoUrl ? (
                                <span className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                    {themeConfig.siteName}
                                </span>
                            ) : (
                                <img
                                    src={themeConfig.logoUrl}
                                    alt={`${themeConfig.siteName} logo`}
                                    className="h-14 md:h-16 w-auto object-contain"
                                    onError={() => setLogoFailed(true)}
                                />
                            )}
                        </Link>
                    </div>

                    {/* Desktop Navigation - Right */}
                    <div className="hidden md:flex md:items-center space-x-3 lg:space-x-4">
                        <Link href="/" className="px-5 py-2 rounded-full font-black uppercase tracking-wider text-sm transition-all shadow-sm bg-brand text-white hover:bg-accent hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
                            HOME
                        </Link>
                        <Link href="/events" className="px-5 py-2 rounded-full font-black uppercase tracking-wider text-sm transition-all shadow-sm bg-brand text-white hover:bg-accent hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
                            EVENTS
                        </Link>
                        <Link href="/#news" className="px-5 py-2 rounded-full font-black uppercase tracking-wider text-sm transition-all shadow-sm bg-brand text-white hover:bg-accent hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
                            NEWS
                        </Link>
                        <Link href="/podcasts" className="px-5 py-2 rounded-full font-black uppercase tracking-wider text-sm transition-all shadow-sm bg-brand text-white hover:bg-accent hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
                            {(themeConfig.admin?.podcastLabel || 'Podcasts').toUpperCase()}
                        </Link>
                        {/* Auth Buttons */}
                        <div className="pl-4 border-l border-white/20">
                            {session?.user ? (
                                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand font-bold tracking-wide text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link href="/api/auth/signin" className="px-5 py-2 rounded-full bg-ink text-white font-bold tracking-wide text-sm transition-all shadow-sm hover:bg-black hover:shadow-md whitespace-nowrap">
                                    Admin Login
                                </Link>
                            )}
                        </div>

                        {/* Social Icons (White on Cyan) */}
                        <div className="flex items-center space-x-3 ml-2 pl-2">
                            {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                            )}
                            <a
                                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:bg-white/10 p-2 rounded-lg"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-6 pt-2 px-2 border-t border-white/20 mt-2">
                        <div className="flex flex-col space-y-3">
                            {session?.user ? (
                                <Link 
                                    href="/admin" 
                                    className="block px-6 py-3 rounded-xl font-bold text-center bg-white text-brand shadow-sm flex items-center justify-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link 
                                    href="/api/auth/signin" 
                                    className="block px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-center bg-ink text-white hover:bg-black shadow-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Admin Login
                                </Link>
                            )}
                            
                            <Link href="/" className="block px-6 py-3 rounded-xl font-black uppercase tracking-wider text-center bg-brand text-white hover:bg-accent shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="/events" className="block px-6 py-3 rounded-xl font-black uppercase tracking-wider text-center bg-brand text-white hover:bg-accent shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                                Events
                            </Link>
                            <Link href="/podcasts" className="block px-6 py-3 rounded-xl font-black uppercase tracking-wider text-center bg-brand text-white hover:bg-accent shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                                {themeConfig.admin?.podcastLabel || 'Podcasts'}
                            </Link>

                            <div className="flex items-center justify-center space-x-6 pt-4 mt-2">
                                {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                                    <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                )}
                                <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "#"} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
