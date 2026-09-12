"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut, auth } from "@/auth";

export async function login(formData: FormData) {
    try {
        await signIn("credentials", formData, { redirectTo: "/admin/events" });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password." };
                default:
                    return { error: "Something went wrong." };
            }
        }
        // Next.js implements redirects by throwing — let those through.
        throw error;
    }
}

export type ChangePasswordState = { error?: string; success?: string } | null;

export async function changePassword(prevState: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return { error: "You are not signed in" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword) {
        return { error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
        return { error: "New passwords do not match" };
    }

    if (newPassword.length < 8) {
        return { error: "New password must be at least 8 characters" };
    }

    try {
        const user = await (prisma as any).user.findUnique({ where: { email } });

        if (!user?.passwordHash) {
            return { error: "Account not found" };
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return { error: "Current password is incorrect" };
        }

        await (prisma as any).user.update({
            where: { email },
            data: { passwordHash: await bcrypt.hash(newPassword, 10) },
        });

        return {
            success: "Password updated. ADMIN_PASSWORD in .env is only used to create the first admin — keep it in sync to avoid confusion.",
        };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { error: "Failed to update password" };
    }
}

export async function logout() {
    await signOut({ redirectTo: "/" });
}
