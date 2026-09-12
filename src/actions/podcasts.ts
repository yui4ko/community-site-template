'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function createPodcast(formData: FormData) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoUrl = formData.get('videoUrl') as string;

    if (!title || !videoUrl) return;

    await prisma.podcast.create({
        data: {
            title,
            description,
            videoUrl,
        }
    });

    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
    redirect('/admin/podcasts');
}

export async function deletePodcast(formData: FormData) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string;
    if (!id) return;

    await prisma.podcast.delete({
        where: { id }
    });

    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
}

export async function updatePodcast(formData: FormData) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoUrl = formData.get('videoUrl') as string;

    if (!id || !title || !videoUrl) return;

    await prisma.podcast.update({
        where: { id },
        data: {
            title,
            description,
            videoUrl,
        }
    });

    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
    revalidatePath(`/podcasts/${id}`);
    redirect('/admin/podcasts');
}

export async function togglePodcastVisibility(id: string, isHidden: boolean) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        throw new Error('Unauthorized');
    }

    if (!id) return { success: false, error: 'Invalid ID' };

    try {
        await prisma.podcast.update({
            where: { id },
            data: { isHidden }
        });

        revalidatePath('/admin/podcasts');
        revalidatePath('/podcasts');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

