
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const NewsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    publishDate: z.string().min(1, "Publish date is required"),
    imageUrl: z.string().optional().or(z.literal("")),
});

type ActionState = {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
} | null;

export async function createNews(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = NewsSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Validation Failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { publishDate, ...otherData } = validatedFields.data;

    try {
        await prisma.news.create({
            data: {
                ...otherData,
                publishDate: new Date(publishDate),
            },
        });
    } catch (error) {
        console.error("Create News Error:", error);
        return { error: "Database Error: Failed to Create News" };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
    redirect('/admin/news');
}

export async function updateNews(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = NewsSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Validation Failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { publishDate, ...otherData } = validatedFields.data;

    try {
        await prisma.news.update({
            where: { id },
            data: {
                ...otherData,
                publishDate: new Date(publishDate),
            },
        });
    } catch (error) {
        console.error("Update News Error:", error);
        return { error: "Database Error: Failed to Update News" };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath(`/news/${id}`);
    revalidatePath('/');
    redirect('/admin/news');
}

export async function deleteNews(id: string) {
    try {
        await prisma.news.delete({
            where: { id },
        });
        revalidatePath('/admin/news');
        revalidatePath('/news');
        revalidatePath('/');
    } catch (error) {
        console.error("Delete News Error:", error);
        return { error: "Failed to delete news" };
    }
}
