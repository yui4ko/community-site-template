
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default function SettingsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                <p className="text-gray-500">Manage your account preferences.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Change Password</h2>
                <ChangePasswordForm />
            </div>
        </div>
    );
}
