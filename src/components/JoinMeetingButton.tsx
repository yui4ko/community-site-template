
'use client';

interface JoinMeetingButtonProps {
    meetingUrl?: string | null;
    eventDate: Date;
    showJoinButton: boolean;
}

export default function JoinMeetingButton({ meetingUrl, showJoinButton }: JoinMeetingButtonProps) {
    // We could also do client-side calculation here to auto-enable without refresh
    // But for now, we'll stick to the passed prop for consistency with server render

    return (
        <>
            <a
                href={meetingUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg transform active:scale-95 ${showJoinButton
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-red-500/30 hover:-translate-y-1 animate-pulse"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                onClick={(e) => !showJoinButton && e.preventDefault()}
            >
                {showJoinButton ? "Join Live Meeting Now" : "Join Meeting (Starts soon)"}
            </a>
            {!showJoinButton && (
                <p className="text-xs text-center text-gray-400">
                    Link activates 20 mins before start
                </p>
            )}
        </>
    );
}
