'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { format } from 'date-fns';
import UploadButton from './UploadButton';
import RichTextEditor from './RichTextEditor';

type ActionState = {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
    payload?: any;
} | null;

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-1 bg-brand text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {pending ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
        </button>
    );
}

// Helper to format date for datetime-local input (YYYY-MM-DDThh:mm) - LOCAL TIME
const formatDateForInput = (date?: Date | string) => {
    if (!date) {
        // Default to Today at 18:30 LOCAL TIME
        const now = new Date();
        now.setHours(18, 30, 0, 0);
        return format(now, "yyyy-MM-dd'T'HH:mm");
    }
    try {
        // Convert UTC -> Local Time string for input
        return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
    } catch (e) { return ''; }
};

export default function EventForm({ action, initialData }: { action: (state: ActionState, formData: FormData) => Promise<ActionState>, initialData?: any }) {
    const [state, formAction] = useActionState(action, null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [description, setDescription] = useState(initialData?.description || "");
    const [abstract, setAbstract] = useState(initialData?.abstract || "");

    useEffect(() => {
        // Hydrate photos from payload (if error) or initialData (if edit)
        if (state?.payload?.photosJson) {
            try {
                const parsed = JSON.parse(state.payload.photosJson);
                if (Array.isArray(parsed)) setPhotos(parsed);
            } catch (e) { }
        } else if (initialData?.photos && Array.isArray(initialData.photos)) {
            setPhotos(initialData.photos);
        }

        // Hydrate rich text if present in payload (on error)
        if (state?.payload?.description) setDescription(state.payload.description);
        if (state?.payload?.abstract) setAbstract(state.payload.abstract);
    }, [initialData, state?.payload]);

    const getValue = (key: string) => {
        return state?.payload?.[key] ?? initialData?.[key];
    };

    const addPhoto = (url: string) => {
        setPhotos(prev => [...prev, { imageUrl: url, caption: '' }]);
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form action={formAction} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            {/* Hidden inputs to pass rich text content to Server Action */}
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="abstract" value={abstract} />

            {state?.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    <p className="font-bold">{state.error}</p>
                    {state.fieldErrors && (
                        <ul className="list-disc list-inside mt-2 text-sm">
                            {Object.entries(state.fieldErrors).map(([key, errors]: [string, any]) => (
                                <li key={key}>{errors}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Basic Info</h3>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                        <input name="title" defaultValue={getValue('title')} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time ({Intl.DateTimeFormat().resolvedOptions().timeZone}) *</label>
                        <input
                            type="datetime-local"
                            defaultValue={formatDateForInput(getValue('date'))}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                            onChange={(e) => {
                                const val = e.target.value;
                                const hidden = document.getElementById('hidden-date-field') as HTMLInputElement;
                                if (val && hidden) {
                                    // Treat input as Local -> Convert to ISO UTC
                                    const d = new Date(val);
                                    hidden.value = d.toISOString();
                                }
                            }}
                        />
                        <input
                            type="hidden"
                            name="date"
                            id="hidden-date-field"
                            defaultValue={(() => {
                                // Initial value for hidden field must match the default visual one
                                const raw = getValue('date');
                                if (raw) return new Date(raw).toISOString();
                                const now = new Date();
                                now.setHours(18, 30, 0, 0);
                                return now.toISOString();
                            })()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                        <select name="type" defaultValue={getValue('type') || 'tech_talk'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none">
                            <option value="tech_talk">Tech Talk</option>
                            <option value="get_together">Get Together</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <select name="status" defaultValue={getValue('status') || 'upcoming'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none">
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <input
                            type="checkbox"
                            name="showInList"
                            id="showInList"
                            defaultChecked={getValue('showInList') !== false}
                            className="w-5 h-5 text-brand rounded focus:ring-brand cursor-pointer"
                        />
                        <label htmlFor="showInList" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                            Show in Upcoming List?
                            <p className="text-xs text-gray-400 font-normal">Uncheck to keep in Calendar/ICS only (hidden from card list).</p>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Method</label>
                        <select
                            name="deliveryMethod"
                            defaultValue={getValue('deliveryMethod') || 'online'}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
                            onChange={(e) => {
                                const method = e.target.value;
                                const meetingEl = document.getElementById('meeting-url-field');
                                const locationEl = document.getElementById('location-fields');

                                if (meetingEl) meetingEl.style.display = (method === 'online' || method === 'hybrid') ? 'block' : 'none';
                                if (locationEl) locationEl.style.display = (method === 'onsite' || method === 'hybrid') ? 'block' : 'none';
                            }}
                        >
                            <option value="online">Online Only</option>
                            <option value="onsite">Onsite Only</option>
                            <option value="hybrid">Hybrid (Both)</option>
                        </select>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Details & Media</h3>

                    <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
                        <label className="block text-sm font-bold text-brand mb-2">Main Banner Image (1200x628 Recommended)</label>
                        <p className="text-[10px] text-gray-500 mb-2 italic">This is the large image displayed at the top of the event page.</p>
                        <input id="bannerImageUrl" name="bannerImageUrl" defaultValue={getValue('bannerImageUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none text-xs mb-2 bg-white" placeholder="URL or Upload..." />
                        <UploadButton label="Upload Banner" onUploadComplete={(url: string) => {
                            const el = document.getElementById('bannerImageUrl') as HTMLInputElement;
                            if (el) el.value = url;
                        }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Name</label>
                            <input name="speaker" defaultValue={getValue('speaker')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Title / Role</label>
                            <input name="speakerTitle" defaultValue={getValue('speakerTitle')} placeholder="e.g. Cybersecurity leader..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Photo</label>
                            <div className="flex flex-col gap-2">
                                <input id="speakerPhotoUrl" name="speakerPhotoUrl" defaultValue={getValue('speakerPhotoUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none text-xs" placeholder="URL or Upload..." />
                                <UploadButton label="Upload Photo" onUploadComplete={(url: string) => {
                                    const el = document.getElementById('speakerPhotoUrl') as HTMLInputElement;
                                    if (el) el.value = url;
                                }} />
                            </div>
                        </div>
                    </div>

                    <div id="location-fields" style={{ display: (getValue('deliveryMethod') === 'onsite' || getValue('deliveryMethod') === 'hybrid') ? 'block' : 'none' }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Location Name (e.g. San Ramon CC)</label>
                                <input name="location" defaultValue={getValue('location')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Physical Address</label>
                                <input name="address" defaultValue={getValue('address')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" placeholder="123 Quality St, San Ramon, CA" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed HTML / Link</label>
                                <input name="mapUrl" defaultValue={getValue('mapUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" placeholder="https://www.google.com/maps/embed?..." />
                            </div>
                        </div>
                    </div>

                    <div id="meeting-url-field" style={{ display: (getValue('deliveryMethod') === 'online' || getValue('deliveryMethod') === 'hybrid' || !getValue('deliveryMethod')) ? 'block' : 'none' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Meeting URL (Zoom/Teams)</label>
                        <input type="url" name="meetingUrl" defaultValue={getValue('meetingUrl') ?? ""} placeholder="https://zoom.us/..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slides (PDF/PPT)</label>
                                <input id="slidesUrl" name="slidesUrl" defaultValue={getValue('slidesUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none text-xs mb-2" placeholder="URL or Upload..." />
                                <UploadButton label="Upload Slides" accept=".pdf,.ppt,.pptx" onUploadComplete={(url: string) => {
                                    const el = document.getElementById('slidesUrl') as HTMLInputElement;
                                    if (el) el.value = url;
                                }} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Recording URL (Zoom/YT)</label>
                                <input name="recordingUrl" type="url" defaultValue={getValue('recordingUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Event Photo Gallery (Add Photos)</label>
                        <p className="text-[10px] text-gray-400 mb-2 italic">Images for the past event highlights wall.</p>
                        <div className="flex gap-2 mb-4">
                            <UploadButton label="Add Photo to Gallery" onUploadComplete={addPhoto} multiple={true} />
                        </div>

                        {photos.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                                {photos.map((p, idx) => (
                                    <div key={idx} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                        <img src={p.imageUrl} className="w-full h-full object-cover" alt="Gallery item" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-md"
                                            title="Remove photo"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input type="hidden" name="photosJson" value={JSON.stringify(photos)} />
                    </div>
                </div>
            </div>

            {/* Rich Text Areas */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description (Full Details)</label>
                    <RichTextEditor value={description} onChange={setDescription} placeholder="Event details, agenda, key takeaways..." />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Abstract (Card Summary)</label>
                    <RichTextEditor value={abstract} onChange={setAbstract} placeholder="Brief summary displayed on event cards..." />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Bio</label>
                    <textarea name="speakerBio" rows={3} defaultValue={getValue('speakerBio')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand outline-none" />
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <Link href="/admin/events" className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center">
                    Cancel
                </Link>
                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    );
}
