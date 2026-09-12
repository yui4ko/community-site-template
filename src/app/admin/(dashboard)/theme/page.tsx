'use client';

import { useState, useEffect } from 'react';
import { getTheme, updateTheme } from '@/actions/theme';
import UploadButton from '@/components/admin/UploadButton';

export default function ThemeSettings() {
    const [theme, setTheme] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getTheme().then(data => {
            setTheme(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        if (section) {
            setTheme({
                ...theme,
                [section]: {
                    ...theme[section],
                    [field]: value
                }
            });
        } else {
            setTheme({
                ...theme,
                [field]: value
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await updateTheme(theme);
        if (res.success) {
            alert('Theme updated successfully! Refresh the page to see the changes.');
        } else {
            alert('Failed to update theme.');
        }
        setSaving(false);
    };

    if (loading) return <div>Loading theme settings...</div>;

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
                    <p className="text-gray-500">Manage site logo, text, colors, and links.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand hover:bg-brand-light text-white font-bold py-2 px-6 rounded-xl transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                
                {/* General Settings */}
                <section>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                            <input 
                                type="text" 
                                value={theme.siteName || ''} 
                                onChange={e => handleChange('', 'siteName', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                            <UploadButton 
                                onUploadComplete={(url) => handleChange('', 'logoUrl', url)} 
                                currentUrl={theme.logoUrl}
                                label="Upload New Logo"
                            />
                            <div className="mt-2 text-xs text-gray-500 break-all">Current: {theme.logoUrl}</div>
                        </div>
                    </div>
                </section>

                {/* Hero Section */}
                <section>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Hero Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Badge Text</label>
                            <input type="text" value={theme.hero?.badge || ''} onChange={e => handleChange('hero', 'badge', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                            <textarea value={theme.hero?.title || ''} onChange={e => handleChange('hero', 'title', e.target.value)} className="w-full px-4 py-2 border rounded-xl" rows={3} />
                            <p className="text-xs text-gray-500 mt-1">Use \n for new lines</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
                        <textarea value={theme.hero?.subtitle || ''} onChange={e => handleChange('hero', 'subtitle', e.target.value)} className="w-full px-4 py-2 border rounded-xl" rows={3} />
                    </div>
                </section>

                {/* Social Links (Assuming stored in hero or globally) */}
                <section>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Links & Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Button Text</label>
                            <input type="text" value={theme.hero?.primaryLinkText || ''} onChange={e => handleChange('hero', 'primaryLinkText', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Button URL</label>
                            <input type="text" value={theme.hero?.primaryLinkUrl || ''} onChange={e => handleChange('hero', 'primaryLinkUrl', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Button Text</label>
                            <input type="text" value={theme.hero?.secondaryLinkText || ''} onChange={e => handleChange('hero', 'secondaryLinkText', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Button URL</label>
                            <input type="text" value={theme.hero?.secondaryLinkUrl || ''} onChange={e => handleChange('hero', 'secondaryLinkUrl', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                        </div>
                    </div>
                </section>

                {/* Colors Section */}
                <section>
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={theme.colors?.primary || '#042c5c'} onChange={e => handleChange('colors', 'primary', e.target.value)} className="h-10 w-10 cursor-pointer rounded border-0 p-0" />
                                <input type="text" value={theme.colors?.primary || '#042c5c'} onChange={e => handleChange('colors', 'primary', e.target.value)} className="w-full px-4 py-2 border rounded-xl font-mono text-sm uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={theme.colors?.secondary || '#28a745'} onChange={e => handleChange('colors', 'secondary', e.target.value)} className="h-10 w-10 cursor-pointer rounded border-0 p-0" />
                                <input type="text" value={theme.colors?.secondary || '#28a745'} onChange={e => handleChange('colors', 'secondary', e.target.value)} className="w-full px-4 py-2 border rounded-xl font-mono text-sm uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Dark Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={theme.colors?.dark || '#1e293b'} onChange={e => handleChange('colors', 'dark', e.target.value)} className="h-10 w-10 cursor-pointer rounded border-0 p-0" />
                                <input type="text" value={theme.colors?.dark || '#1e293b'} onChange={e => handleChange('colors', 'dark', e.target.value)} className="w-full px-4 py-2 border rounded-xl font-mono text-sm uppercase" />
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        </div>
    );
}
