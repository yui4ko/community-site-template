/**
 * Renders a talk recording inline.
 *
 * YouTube and Vimeo URLs are turned into a responsive iframe; anything else
 * (Zoom cloud recordings, Drive links, …) degrades to a styled link so the
 * admin can paste whatever they have.
 */

function toEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
        }
        if (host.endsWith('youtube.com')) {
            const v = u.searchParams.get('v');
            if (v) return `https://www.youtube.com/embed/${v}`;
            const m = u.pathname.match(/\/(embed|live|shorts)\/([\w-]+)/);
            if (m) return `https://www.youtube.com/embed/${m[2]}`;
        }
        if (host.endsWith('vimeo.com')) {
            const id = u.pathname.split('/').filter(Boolean)[0];
            if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
        }
    } catch {
        return null;
    }
    return null;
}

export default function VideoEmbed({ url, title }: { url: string; title?: string }) {
    const embedUrl = toEmbedUrl(url);

    if (!embedUrl) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full rounded-3xl border border-gray-200 bg-white p-8 font-bold text-brand hover:border-brand hover:bg-gray-50 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Watch the recording
            </a>
        );
    }

    return (
        <div className="rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-gray-200">
            <div className="relative w-full aspect-video">
                <iframe
                    src={embedUrl}
                    title={title ? `${title} — recording` : 'Talk recording'}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
