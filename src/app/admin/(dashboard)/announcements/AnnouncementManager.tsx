'use client';

import { useState } from 'react';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/actions/announcement';
import { format } from 'date-fns';

export default function AnnouncementManager({ initialData }: { initialData: any[] }) {
    const [announcements, setAnnouncements] = useState(initialData);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        linkUrl: '',
        linkText: '',
        type: 'info',
        isActive: true
    });

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', description: '', linkUrl: '', linkText: '', type: 'info', isActive: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            const res = await updateAnnouncement(editingId, formData);
            if (res.success) {
                setAnnouncements(announcements.map(a => a.id === editingId ? { ...a, ...formData } : a));
                handleCancel();
            } else {
                alert('Failed to update: ' + res.error);
            }
        } else {
            const res = await createAnnouncement(formData);
            if (res.success) {
                setAnnouncements([res.data, ...announcements]);
                handleCancel();
            } else {
                alert('Failed to create: ' + res.error);
            }
        }
        setLoading(false);
    };

    const toggleActive = async (id: string, current: boolean) => {
        const res = await updateAnnouncement(id, { isActive: !current });
        if (res.success) {
            setAnnouncements(announcements.map(a => a.id === id ? { ...a, isActive: !current } : a));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you absolutely sure you want to delete this announcement?')) return;
        const res = await deleteAnnouncement(id);
        if (res.success) {
            setAnnouncements(announcements.filter(a => a.id !== id));
        } else {
            alert('Failed to delete: ' + (res.error || 'Unknown error'));
        }
    };

    const handleEdit = (a: any) => {
        setFormData({
            title: a.title || '',
            description: a.description || '',
            linkUrl: a.linkUrl || '',
            linkText: a.linkText || '',
            type: a.type || 'info',
            isActive: a.isActive
        });
        setEditingId(a.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => isCreating ? handleCancel() : setIsCreating(true)}
                    className="bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                    {isCreating ? 'Cancel' : 'Create New Announcement'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title (Required)</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" placeholder="e.g. Registration is open!" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type (Color Theme)</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent">
                                <option value="info">Info (Blue)</option>
                                <option value="success">Success (Green)</option>
                                <option value="warning">Warning (Yellow)</option>
                                <option value="event">Event (Purple)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent h-24" placeholder="Brief details about the announcement..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Call to Action Link URL (Optional)</label>
                            <input type="text" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" placeholder="/events" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Link Button Text (Optional)</label>
                            <input type="text" value={formData.linkText} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" placeholder="Learn more" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand" />
                        <label htmlFor="isActive" className="text-gray-700 font-bold">Show immediately on homepage?</label>
                    </div>
                    <div className="pt-5 border-t border-gray-100">
                        <button disabled={loading} type="submit" className="w-full bg-brand hover:bg-brand-light disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                            {loading ? 'Saving...' : (editingId ? 'Update Announcement' : 'Save Announcement')}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {announcements.map((a: any) => (
                    <div key={a.id} className={`p-6 rounded-2xl border ${a.isActive ? 'border-brand/25 bg-brand/[0.03]' : 'border-gray-100 bg-white'} shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {a.isActive ? 'Active' : 'Hidden'}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{a.type}</span>
                                <span className="text-xs text-gray-500">- {format(new Date(a.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{a.title}</h3>
                            {a.description && <p className="text-gray-600 text-sm mb-4">{a.description}</p>}
                            {a.linkUrl && (
                                <a href={a.linkUrl} target="_blank" className="inline-block text-sm text-brand hover:text-brand-light font-bold bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/15">
                                    {a.linkText || 'Learn More'} →
                                </a>
                            )}
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <button onClick={() => toggleActive(a.id, a.isActive)} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                                {a.isActive ? 'Hide' : 'Activate'}
                            </button>
                            <button onClick={() => handleEdit(a)} className="flex-1 md:flex-none px-4 py-2 bg-brand/5 hover:bg-brand/10 text-brand text-sm font-bold rounded-xl transition-colors">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="flex-1 md:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold rounded-xl transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
