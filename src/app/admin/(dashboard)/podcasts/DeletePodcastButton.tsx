'use client';


// Using a Client Component allows us to use onSubmit with confirm.
export default function DeletePodcastButton({ 
    id, 
    deleteAction 
}: { 
    id: string, 
    deleteAction: (formData: FormData) => void 
}) {
    return (
        <form 
            action={deleteAction} 
            className="inline" 
            onSubmit={(e) => {
                if(!confirm('Are you sure you want to delete this podcast?')) {
                    e.preventDefault();
                }
            }}
        >
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
                Delete
            </button>
        </form>
    );
}
