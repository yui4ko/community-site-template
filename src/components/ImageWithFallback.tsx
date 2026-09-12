
'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/defaults/event-default-1.png"; // Professional abstract event default

export default function ImageWithFallback({
    src,
    fallbackSrc = DEFAULT_FALLBACK,
    alt,
    ...props
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <img
            {...props}
            src={imgSrc || fallbackSrc}
            alt={alt || "Image"}
            onError={handleError}
        />
    );
}
