'use server';

import { prisma } from '@/lib/prisma';
import defaultTheme from '../../theme.json';

// Return the merged theme from DB and defaults
export async function getTheme() {
    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key: 'theme' }
        });
        
        if (setting && setting.value) {
            return { ...defaultTheme, ...JSON.parse(setting.value) };
        }
    } catch (e) {
        console.error('Error fetching theme from DB:', e);
    }
    
    return defaultTheme;
}

export async function updateTheme(newTheme: any) {
    try {
        await prisma.siteSetting.upsert({
            where: { key: 'theme' },
            update: { value: JSON.stringify(newTheme) },
            create: { key: 'theme', value: JSON.stringify(newTheme) }
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
