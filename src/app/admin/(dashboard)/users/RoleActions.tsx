"use client";

import { useState } from "react";
import { updateUserRole, deleteUser } from "@/actions/admin-users";
import {
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

type Props = {
    user: { id: string, role: string }
};

export default function RoleActions({ user }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRoleChange = async (newRole: string) => {
        if (newRole === user.role) return;
        setIsUpdating(true);
        await updateUserRole(user.id, newRole);
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setIsUpdating(true);
            await deleteUser(user.id);
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={user.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={isUpdating}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none focus:ring-1 focus:ring-brand cursor-pointer transition-all disabled:opacity-50"
            >
                <option value="MEMBER">Member</option>
                <option value="SPEAKER">Speaker</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
            </select>

            <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                title="Delete User"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}
