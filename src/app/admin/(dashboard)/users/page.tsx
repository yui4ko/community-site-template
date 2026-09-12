import { getUsers, updateUserRole, deleteUser } from "@/actions/admin-users";
import { format } from "date-fns";
import {
    UserIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    GlobeAltIcon,
    TrashIcon
} from "@heroicons/react/24/outline";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">User Management</h2>
                    <p className="text-gray-400 mt-1">Manage member account roles and permissions.</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-3">
                    <span className="text-blue-400 font-mono text-sm uppercase tracking-widest">
                        Total Members: {users.length}
                    </span>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
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
                                                <p className="font-bold text-white truncate">{user.name || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <RoleBadge role={user.role} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-400 whitespace-nowrap">
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
        ADMIN: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: ShieldCheckIcon },
        MODERATOR: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: IdentificationIcon },
        SPEAKER: { color: 'text-brand bg-brand/10 border-brand/20', icon: GlobeAltIcon },
        MEMBER: { color: 'text-gray-400 bg-white/5 border-white/10', icon: UserIcon },
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
