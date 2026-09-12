'use client';

import { useState, useEffect, useCallback } from 'react';
import ImageWithFallback from './ImageWithFallback';

type Photo = {
    id: string;
    imageUrl: string;
    caption?: string | null;
};

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const showNext = useCallback(() => {
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
    }, [photos.length]);

    const showPrev = useCallback(() => {
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + photos.length) % photos.length));
    }, [photos.length]);

    // Swipe Logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) showNext();
        if (isRightSwipe) showPrev();
    };

    // Keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, showNext, showPrev]);

    if (!photos || photos.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                Event Highlights
            </h3>

            {/* Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, idx) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-gray-100 cursor-pointer bg-gray-100"
                        onClick={() => openLightbox(idx)}
                    >
                        <ImageWithFallback
                            src={photo.imageUrl}
                            alt={photo.caption || 'Event photo'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        className="absolute left-4 z-50 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        className="absolute right-4 z-50 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-screen p-4 flex items-center justify-center"
                        onClick={closeLightbox} // Click outside to close
                    >
                        <div
                            className="relative max-h-[85vh] w-auto max-w-full rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Click image shouldn't close
                        >
                            <ImageWithFallback
                                src={photos[selectedIndex].imageUrl}
                                alt={photos[selectedIndex].caption || 'Event photo'}
                                className="object-contain max-h-[85vh] w-auto bg-black"
                            // Note: using object-contain to ensure we see the whole image without cropping
                            />

                            {/* Caption */}
                            {photos[selectedIndex].caption && (
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-4 text-white text-center">
                                    <p className="text-sm md:text-base font-medium">
                                        {photos[selectedIndex].caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 text-white/50 font-mono text-sm">
                        {selectedIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </div>
    );
}
