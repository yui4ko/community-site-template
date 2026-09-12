"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAnnouncements(includeInactive = false) {
    try {
        const whereClause = includeInactive ? {} : { isActive: true };
        return await (prisma as any).announcement.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return [];
    }
}

export async function createAnnouncement(data: {
    title: string;
    description?: string;
    linkUrl?: string;
    linkText?: string;
    isActive: boolean;
    type: string;
    createdBy?: string;
}) {
    try {
        const result = await (prisma as any).announcement.create({
            data
        });
        revalidatePath('/');
        revalidatePath('/admin/announcements');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create announcement:", error);
        return { error: error.message };
    }
}

export async function updateAnnouncement(id: string, data: Partial<{
    title: string;
    description: string;
    linkUrl: string;
    linkText: string;
    isActive: boolean;
    type: string;
}>) {
    try {
        const result = await (prisma as any).announcement.update({
            where: { id },
            data
        });
        revalidatePath('/');
        revalidatePath('/admin/announcements');
        return { success: true, data: result };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        await (prisma as any).announcement.delete({
            where: { id }
        });
        revalidatePath('/');
        revalidatePath('/admin/announcements');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
