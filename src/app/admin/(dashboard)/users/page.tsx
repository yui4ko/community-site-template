import { getUsers } from "@/actions/admin-users";
import { format } from "date-fns";
import {
    UserIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage member account roles and permissions.</p>
                </div>
                <div className="bg-brand/5 border border-brand/15 rounded-2xl px-6 py-3">
                    <span className="text-brand font-mono text-sm uppercase tracking-widest">
                        Total Members: {users.length}
                    </span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center ring-1 ring-brand/30 overflow-hidden shrink-0">
                                                {user.image ? (
                                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-5 h-5 text-brand" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{user.name || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <RoleBadge role={user.role} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <UserActionsDropdown user={user} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    const configs: Record<string, { color: string, icon: any }> = {
        ADMIN: { color: 'text-red-700 bg-red-50 border-red-200', icon: ShieldCheckIcon },
        MODERATOR: { color: 'text-purple-700 bg-purple-50 border-purple-200', icon: IdentificationIcon },
        SPEAKER: { color: 'text-teal-700 bg-teal-50 border-teal-200', icon: GlobeAltIcon },
        MEMBER: { color: 'text-gray-600 bg-gray-100 border-gray-200', icon: UserIcon },
    };

    const config = configs[role] || configs.MEMBER;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
            <Icon className="w-3 h-3" />
            {role}
        </span>
    );
}

// Client component for interaction
import RoleActions from "./RoleActions";
function UserActionsDropdown({ user }: { user: any }) {
    return <RoleActions user={userIdAndRole(user)} />;
}

function userIdAndRole(user: any) {
    return { id: user.id, role: user.role };
}
