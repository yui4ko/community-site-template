
import EventForm from '@/components/admin/EventForm';
import { updateEvent } from '@/actions/events';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
        include: { photos: true },
    });

    if (!event) {
        notFound();
    }

    // Bind ID to action
    const updateAction = updateEvent.bind(null, event.id);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
            <EventForm action={updateAction} initialData={event} />
        </div>
    );
}
