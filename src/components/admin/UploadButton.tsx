'use client';

import { useState } from 'react';

interface UploadButtonProps {
    onUploadComplete: (url: string) => void;
    label?: string;
    accept?: string;
    currentUrl?: string;
    multiple?: boolean;
}

export default function UploadButton({ onUploadComplete, label = "Upload File", accept = "image/*,application/pdf", currentUrl, multiple = false }: UploadButtonProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`[Upload] Processing ${i + 1}/${files.length}: ${file.name}`);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const endpoint = '/api/upload';
                const res = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error(`Status ${res.status}`);

                const data = await res.json();
                if (data.url) {
                    onUploadComplete(data.url);
                    successCount++;
                }
            } catch (err: any) {
                console.error(`[Upload] Failed to upload ${file.name}:`, err);
                failCount++;
            }
        }

        if (failCount > 0) {
            alert(`Completed: ${successCount} success, ${failCount} failed.`);
        }

        setIsUploading(false);
        e.target.value = '';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors text-sm font-bold border border-gray-200">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {isUploading ? 'Uploading...' : label}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        accept={accept}
                        disabled={isUploading}
                        multiple={multiple}
                    />
                </label>
                {(currentUrl || isUploading) && (
                    <span className={`text-xs font-medium truncate max-w-[200px] ${isUploading ? 'text-blue-500 animate-pulse' : 'text-green-600'}`}>
                        {isUploading ? 'Processing...' : '✓ File attached'}
                    </span>
                )}
            </div>
        </div>
    );
}
