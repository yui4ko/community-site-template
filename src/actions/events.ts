
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const EventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    abstract: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    type: z.string().default("tech_talk"),
    status: z.string().default("upcoming"),
    deliveryMethod: z.string().default("online"), // online, onsite, hybrid
    showInList: z.boolean().default(true),
    speaker: z.string().optional(),
    speakerTitle: z.string().optional(),
    speakerBio: z.string().optional(),
    speakerPhotoUrl: z.string().optional().or(z.literal("")),
    bannerImageUrl: z.string().optional().or(z.literal("")),
    location: z.string().optional(), // Building name / platform
    address: z.string().optional(),  // Physical address
    mapUrl: z.string().optional(),   // Google Maps embed or link
    meetingUrl: z.string().optional().or(z.literal("")),
    slidesUrl: z.string().optional().or(z.literal("")),
    recordingUrl: z.string().optional().or(z.literal("")),
});

type ActionState = {
    error?: string;
    fieldErrors?: Record<string, string[] | undefined>;
    payload?: any;
} | null;

export async function createEvent(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries()) as any;

    // Handle Checkbox
    rawData.showInList = formData.get('showInList') === 'on';

    const validatedFields = EventSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Validation Failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
            payload: rawData,
        };
    }

    const { date, ...otherData } = validatedFields.data;
    const photosJson = formData.get('photosJson') as string;

    try {
        const event = await prisma.event.create({
            data: {
                ...otherData,
                date: new Date(date),
            } as any,
        });

        if (photosJson) {
            try {
                const photos = JSON.parse(photosJson);
                if (Array.isArray(photos)) {
                    await prisma.eventPhoto.createMany({
                        data: photos.map((p, idx) => ({
                            eventId: event.id,
                            imageUrl: p.imageUrl,
                            caption: p.caption || "",
                            order: p.order || idx
                        }))
                    });
                }
            } catch (e) {
                console.warn("Invalid photos JSON format", e);
            }
        }
    } catch (error) {
        console.error("Create Event Error:", error);
        return { error: "Database Error: Failed to Create Event", payload: rawData };
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    redirect('/admin/events');
}

export async function updateEvent(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries()) as any;

    // Handle Checkbox
    rawData.showInList = formData.get('showInList') === 'on';

    const validatedFields = EventSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Validation Failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
            payload: rawData,
        };
    }

    const { date, ...otherData } = validatedFields.data;
    const photosJson = formData.get('photosJson') as string;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.event.update({
                where: { id },
                data: {
                    ...otherData,
                    date: new Date(date),
                } as any,
            });

            if (photosJson) {
                try {
                    const photos = JSON.parse(photosJson);
                    if (Array.isArray(photos)) {
                        // For simplicity in this edit, we clear and recreate
                        await tx.eventPhoto.deleteMany({ where: { eventId: id } });
                        await tx.eventPhoto.createMany({
                            data: photos.map((p, idx) => ({
                                eventId: id,
                                imageUrl: p.imageUrl,
                                caption: p.caption || "",
                                order: p.order || idx
                            }))
                        });
                    }
                } catch (e) {
                    console.warn("Invalid photos JSON format", e);
                }
            }
        });
    } catch (error) {
        console.error("Update Event Error:", error);
        return { error: "Database Error: Failed to Update Event" };
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    revalidatePath('/');
    redirect('/admin/events');
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({
            where: { id },
        });
        revalidatePath('/admin/events');
        revalidatePath('/events');
        revalidatePath('/');
    } catch (error) {
        console.error("Delete Event Error:", error);
        return { error: "Failed to delete event" };
    }
}
