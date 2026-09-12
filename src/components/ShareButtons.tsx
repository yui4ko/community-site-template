
'use client';

import { useState, useEffect } from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    EmailIcon
} from 'react-share';
import { siteConfig } from '@/lib/site-config';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [currentUrl, setCurrentUrl] = useState(url || '');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url && typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, [url]);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!currentUrl) return null;

    return (
        <div className="flex flex-col gap-3">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Share Event</h4>
            <div className="flex flex-wrap gap-2">
                <LinkedinShareButton url={currentUrl} title={title}>
                    <LinkedinIcon size={40} round />
                </LinkedinShareButton>

                <FacebookShareButton url={currentUrl} hashtag={siteConfig.social.hashtag}>
                    <FacebookIcon size={40} round />
                </FacebookShareButton>

                <TwitterShareButton url={currentUrl} title={title}>
                    <TwitterIcon size={40} round />
                </TwitterShareButton>

                <EmailShareButton url={currentUrl} subject={`Event: ${title}`} body={`Check out this event: ${title}\n\n${currentUrl}`}>
                    <EmailIcon size={40} round />
                </EmailShareButton>

                <button
                    onClick={handleCopy}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
                    title="Copy Link"
                >
                    {copied ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
}
