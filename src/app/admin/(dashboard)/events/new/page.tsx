
import EventForm from '@/components/admin/EventForm';
import { createEvent } from '@/actions/events';

export default function NewEventPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
            <EventForm action={createEvent} />
        </div>
    );
}
